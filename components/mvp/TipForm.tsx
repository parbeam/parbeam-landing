"use client";

import { useState } from "react";
import type { Streamer } from "@/lib/registry";

type Stage = "idle" | "connecting" | "ready" | "signing" | "done" | "error";

const EXPLORER_TX = (h: string) => `https://stellar.expert/explorer/testnet/tx/${h}`;

// Kit is browser-only and initialised once.
let kitReady: Promise<any> | null = null;
async function ensureKit() {
  if (!kitReady) {
    kitReady = (async () => {
      const kitMod = await import("@creit.tech/stellar-wallets-kit");
      const utils = await import("@creit.tech/stellar-wallets-kit/modules/utils");
      kitMod.StellarWalletsKit.init({
        modules: utils.defaultModules(),
        network: kitMod.Networks.TESTNET,
      });
      return { StellarWalletsKit: kitMod.StellarWalletsKit, Networks: kitMod.Networks };
    })();
  }
  return kitReady;
}

export default function TipForm({ streamer }: { streamer: Streamer }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>(String(streamer.minXlm));
  const [message, setMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function connect() {
    setError("");
    setStage("connecting");
    try {
      const { StellarWalletsKit } = await ensureKit();
      const { address } = await StellarWalletsKit.authModal();
      setAddress(address);
      setStage("ready");
    } catch (e: any) {
      if (e?.message) setError(e.message);
      setStage(address ? "ready" : "idle");
    }
  }

  async function sendTip() {
    setError("");
    setStage("signing");
    try {
      const sdk = await import("@stellar/stellar-sdk");
      const { Horizon, TransactionBuilder, Operation, Asset, Memo, BASE_FEE, Networks } = sdk;
      const server = new Horizon.Server("https://horizon-testnet.stellar.org");

      const source = await server.loadAccount(address);
      const builder = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: streamer.address,
            asset: Asset.native(),
            amount: String(amount),
          })
        )
        .setTimeout(180);

      const memo = message.trim().slice(0, 28);
      if (memo) builder.addMemo(Memo.text(memo));
      const tx = builder.build();

      const { StellarWalletsKit, Networks: KitNetworks } = await ensureKit();
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(tx.toXDR(), {
        address,
        networkPassphrase: KitNetworks.TESTNET,
      });

      const signed = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
      const res: any = await server.submitTransaction(signed as any);
      setTxHash(res.hash);
      setStage("done");
    } catch (e: any) {
      const codes = e?.response?.data?.extras?.result_codes;
      setError(codes ? JSON.stringify(codes) : e?.message || "Transaction failed");
      setStage("error");
    }
  }

  const belowMin = Number(amount) < streamer.minXlm;
  const busy = stage === "signing";

  if (stage === "done") {
    return (
      <div className="tipcard">
        <div className="tipdone">✓</div>
        <h2>Tip sent</h2>
        <p className="tipsub">
          {amount} XLM is on its way to {streamer.displayName}. It shows up on their stream in a
          few seconds.
        </p>
        <a className="btn lg full" href={EXPLORER_TX(txHash)} target="_blank" rel="noopener">
          View on Stellar
        </a>
        <button
          className="linkbtn"
          onClick={() => {
            setStage("ready");
            setMessage("");
            setTxHash("");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="tipcard">
      <div className="eyebrow">Tip on Stellar (testnet)</div>
      <h2>
        Support <span className="ambertext">{streamer.displayName}</span>
      </h2>
      <p className="tipsub">Your tip appears live on stream, and it goes straight to their wallet.</p>

      <label className="fld">
        <span>Amount (XLM)</span>
        <input
          type="number"
          min={streamer.minXlm}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      {belowMin && <p className="warn">Minimum is {streamer.minXlm} XLM.</p>}

      <label className="fld">
        <span>Message (shown on stream, up to 28 chars)</span>
        <input
          type="text"
          maxLength={28}
          placeholder="gg from Istanbul"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {address ? (
        <>
          <p className="connected">
            Wallet <code>{address.slice(0, 4)}…{address.slice(-4)}</code> connected
          </p>
          <button className="btn lg full" disabled={belowMin || busy} onClick={sendTip}>
            {busy ? "Confirm in your wallet…" : `Send ${amount} XLM`}
          </button>
        </>
      ) : (
        <button className="btn lg full" onClick={connect} disabled={stage === "connecting"}>
          {stage === "connecting" ? "Opening wallet…" : "Connect wallet"}
        </button>
      )}

      {error && <p className="warn">{error}</p>}
      <p className="tipnote">Testnet only. Fund a wallet with test XLM from the Stellar friendbot.</p>
    </div>
  );
}
