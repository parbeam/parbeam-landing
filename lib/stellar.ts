import { Horizon, Networks } from "@stellar/stellar-sdk";

// Testnet first. Flip these to pubnet later.
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const EXPLORER_TX = (hash: string) =>
  `https://stellar.expert/explorer/testnet/tx/${hash}`;

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
