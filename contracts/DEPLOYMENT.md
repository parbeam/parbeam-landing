# Parbeam Tips — deployment

Non-custodial escrow + routing contract for streamer tips. Viewers tip a
streamer by handle; a bound handle routes straight to the streamer, an unbound
handle escrows in the contract until the streamer's wallet is bound and they
claim. Funds are held by contract code, not any operator key: only the bound
wallet can withdraw a handle's balance, and a handle can be bound only once.

## Testnet

- Contract ID: `CDQNO23SKH65GLUV47X326PLHSY3JHJDDYY4PHPYMOOR3I672KV5QK37`
- Token (native XLM SAC): `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- Admin / attestor: `parbeam-attestor` (binds handle → wallet after off-chain channel-ownership proof; the app signs `set_payout` with `STELLAR_ATTESTOR_SECRET`)
- Network: Test SDF Network ; September 2015

Verified live end to end: escrow (tip to unbound handle) → bind (set_payout) →
claim, plus direct routing (tip to a bound handle goes straight to the wallet).

## App integration

The web app talks to this contract directly:
- Tip page invokes `tip` (viewer signs with their wallet, via Soroban RPC simulate + assemble).
- Onboarding binds the streamer's handle with `set_payout` (server-side, attestor key).
- Overlay and dashboard read `TipEvent`s via RPC `getEvents` (no Horizon).
- Donor name + message are stored off-chain, keyed by the tip's `reference`.

App env vars: `NEXT_PUBLIC_CONTRACT_ID` (defaults to the id above), `STELLAR_ATTESTOR_SECRET` (required for on-chain binding at onboarding).

## Interface

- `tip(from, handle, amount, reference)` — viewer authorizes; routes to the bound wallet or escrows.
- `set_payout(handle, wallet)` — admin binds a handle once (immutable); moves no funds.
- `claim(handle)` — bound wallet withdraws its escrowed balance.
- `balance(handle) -> i128`, `payout(handle) -> Option<Address>` — views.
- Events: `TipEvent { from, handle, amount, direct, reference }`, `ClaimEvent { handle, wallet, amount }`.

## Build / test / deploy

```bash
cd contracts
cargo test
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/parbeam_tips.wasm \
  --source <deployer> --network testnet \
  -- --admin <deployer-address> --token <native-sac>
```
