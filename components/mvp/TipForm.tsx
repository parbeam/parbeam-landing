"use client";

import { useState } from "react";
import type { Streamer } from "@/lib/registry";
import { connectWallet, signTransactionXdr } from "@/lib/kit";
import { CONTRACT_ID, RPC_URL, NETWORK_PASSPHRASE, toStroops, EXPLORER_TX } from "@/lib/contract";

type Stage = "idle" | "connecting" | "ready" | "signing" | "done" | "error";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function TipForm({ streamer }: { streamer: Streamer }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>(String(streamer.minXlm));
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function connect() {
    setError("");
    setStage("connecting");
    try {
      const addr = await connectWallet();
      setAddress(addr);
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
      // Store donor name + message off-chain, keyed by a short reference that
      // the contract carries in its tip event.
      let ref = "";
      try {
        const intentRes = await fetch("/api/intents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: streamer.slug, name, message, amount: Number(amount) }),
        });
        const intent = await intentRes.json();
        if (intentRes.ok && intent.ref) ref = intent.ref;
      } catch {
        // proceed without off-chain name/message if the service is down
      }

      const sdk = await import("@stellar/stellar-sdk");
      const { rpc, Contract, Address, TransactionBuilder, nativeToScVal, BASE_FEE } = sdk;
      const server = new rpc.Server(RPC_URL);

      const account = await server.getAccount(address);
      const contract = new Contract(CONTRACT_ID);
      const op = contract.call(
        "tip",
        Address.fromString(address).toScVal(),
        nativeToScVal(streamer.slug, { type: "string" }),
        nativeToScVal(toStroops(amount), { type: "i128" }),
        nativeToScVal(ref, { type: "string" })
      );

      const built = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(op)
        .setTimeout(120)
        .build();

      const sim = await server.simulateTransaction(built);
      if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error);
      const prepared = rpc.assembleTransaction(built, sim).build();

      const signedXdr = await signTransactionXdr(prepared.toXDR(), address);
      const sent = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
      );
      if (sent.status === "ERROR") throw new Error("The network rejected the transaction.");

      let result = await server.getTransaction(sent.hash);
      for (let i = 0; i < 15 && result.status === "NOT_FOUND"; i++) {
        await sleep(1000);
        result = await server.getTransaction(sent.hash);
      }
      if (result.status !== "SUCCESS") {
        throw new Error("The tip did not confirm. Please try again.");
      }

      setTxHash(sent.hash);
      setStage("done");
    } catch (e: any) {
      setError(e?.message || "Transaction failed");
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
        <span>Your name (shown on stream)</span>
        <input
          type="text"
          maxLength={40}
          placeholder="luna"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="fld">
        <span>Message (shown on stream)</span>
        <input
          type="text"
          maxLength={200}
          placeholder="gg from Istanbul, keep it up!"
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
