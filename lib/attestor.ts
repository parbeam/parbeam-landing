import {
  rpc,
  Contract,
  Address,
  TransactionBuilder,
  Keypair,
  nativeToScVal,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import { CONTRACT_ID, RPC_URL, NETWORK_PASSPHRASE } from "@/lib/contract";

// Server-side: the attestor binds a handle to a streamer wallet in the contract,
// once, after the app has verified the streamer connected that wallet. This is
// what lets future tips route straight to the streamer instead of escrowing.
export async function bindHandle(slug: string, wallet: string): Promise<void> {
  const secret = process.env.STELLAR_ATTESTOR_SECRET;
  if (!secret) throw new Error("STELLAR_ATTESTOR_SECRET is not set");

  const kp = Keypair.fromSecret(secret);
  const server = new rpc.Server(RPC_URL);
  const account = await server.getAccount(kp.publicKey());
  const contract = new Contract(CONTRACT_ID);

  const op = contract.call(
    "set_payout",
    nativeToScVal(slug, { type: "string" }),
    Address.fromString(wallet).toScVal()
  );
  const built = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(60)
    .build();

  const sim = await server.simulateTransaction(built);
  if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  const prepared = rpc.assembleTransaction(built, sim).build();
  prepared.sign(kp);
  const sent = await server.sendTransaction(prepared);
  if (sent.status === "ERROR") {
    throw new Error("bind transaction rejected");
  }
}
