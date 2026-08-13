import { Horizon, Networks } from "@stellar/stellar-sdk";

// Testnet first. Flip these to pubnet later.
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const EXPLORER_TX = (hash: string) =>
  `https://stellar.expert/explorer/testnet/tx/${hash}`;
export const EXPLORER_ACCT = (addr: string) =>
  `https://stellar.expert/explorer/testnet/account/${addr}`;

export const horizon = new Horizon.Server(HORIZON_URL);

export type Tip = {
  id: string;
  cursor: string;
  txHash: string;
  from: string;
  amount: string;
  memo: string;
  createdAt: string;
};

async function toTip(r: any): Promise<Tip> {
  let memo = "";
  try {
    const tx = await r.transaction();
    if (tx && tx.memo_type === "text" && tx.memo) memo = tx.memo;
  } catch {
    // memo is best-effort
  }
  return {
    id: r.id,
    cursor: r.paging_token,
    txHash: r.transaction_hash,
    from: r.from,
    amount: r.amount,
    memo,
    createdAt: r.created_at,
  };
}

const isIncomingXlm = (r: any, address: string) =>
  r.type === "payment" && r.asset_type === "native" && r.to === address;

// Latest paging token, so a client can start listening from "now".
export async function headCursor(address: string): Promise<string> {
  const page = await horizon.payments().forAccount(address).order("desc").limit(1).call();
  return page.records[0] ? page.records[0].paging_token : "0";
}

// New incoming XLM tips after `cursor` (ascending).
export async function tipsAfter(
  address: string,
  cursor: string,
  limit = 20
): Promise<{ cursor: string; tips: Tip[] }> {
  const page = await horizon
    .payments()
    .forAccount(address)
    .cursor(cursor)
    .order("asc")
    .limit(limit)
    .call();
  const incoming = page.records.filter((r: any) => isIncomingXlm(r, address));
  const tips = await Promise.all(incoming.map(toTip));
  const last = page.records[page.records.length - 1];
  return { cursor: last ? last.paging_token : cursor, tips };
}

// Most recent incoming XLM tips (descending), for the dashboard.
export async function recentTips(address: string, limit = 15): Promise<Tip[]> {
  const page = await horizon.payments().forAccount(address).order("desc").limit(limit).call();
  const incoming = page.records.filter((r: any) => isIncomingXlm(r, address));
  return Promise.all(incoming.map(toTip));
}
