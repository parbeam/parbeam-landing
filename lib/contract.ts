import { Networks } from "@stellar/stellar-sdk";

// Parbeam tips contract (testnet). Public id, safe to expose.
export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID ||
  "CDQNO23SKH65GLUV47X326PLHSY3JHJDDYY4PHPYMOOR3I672KV5QK37";

export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const EXPLORER_TX = (h: string) =>
  `https://stellar.expert/explorer/testnet/tx/${h}`;

const DECIMALS = 7;
const SCALE = 10 ** DECIMALS;

export function toStroops(xlm: number | string): bigint {
  return BigInt(Math.round(Number(xlm) * SCALE));
}

export function fromStroops(stroops: bigint | number | string): number {
  return Number(stroops) / SCALE;
}
