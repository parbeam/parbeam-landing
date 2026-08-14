import { rpc, scValToNative } from "@stellar/stellar-sdk";
import { CONTRACT_ID, RPC_URL, fromStroops } from "@/lib/contract";

const server = new rpc.Server(RPC_URL);

export type ContractTip = {
  txHash: string;
  from: string;
  handle: string;
  amount: string; // XLM
  direct: boolean;
  memo: string; // the reference, resolved to name/message off-chain
  ledger: number;
};

export async function latestLedger(): Promise<number> {
  return (await server.getLatestLedger()).sequence;
}

function parseTip(e: any): ContractTip | null {
  if (scValToNative(e.topic[0]) !== "tip") return null;
  const v = scValToNative(e.value) as any;
  return {
    txHash: e.txHash,
    from: v.from,
    handle: v.handle,
    amount: String(fromStroops(v.amount)),
    direct: !!v.direct,
    memo: v.reference || "",
    ledger: e.ledger,
  };
}

// Tip events from `startLedger` onward, optionally filtered to one handle.
export async function tipEvents(
  startLedger: number,
  handle?: string
): Promise<{ latest: number; tips: ContractTip[] }> {
  const res = await server.getEvents({
    startLedger,
    filters: [{ type: "contract", contractIds: [CONTRACT_ID] }],
    limit: 200,
  });
  const tips = res.events
    .map(parseTip)
    .filter((t): t is ContractTip => !!t && (!handle || t.handle === handle));
  return { latest: res.latestLedger, tips };
}

// Recent tips for a handle, for the dashboard. Looks back a bounded window
// that stays within the RPC's getEvents range limit (~a few thousand ledgers).
export async function recentContractTips(
  handle: string,
  lookback = 9000
): Promise<ContractTip[]> {
  const latest = await latestLedger();
  const start = Math.max(1, latest - lookback);
  const { tips } = await tipEvents(start, handle);
  return tips.reverse();
}
