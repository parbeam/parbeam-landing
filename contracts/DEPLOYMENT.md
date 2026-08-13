# Parbeam Tips — deployment

Non-custodial escrow + routing contract for streamer tips. Viewers tip a
streamer by handle; a bound handle routes straight to the streamer, an unbound
handle escrows in the contract until the streamer's wallet is bound and they
claim. Funds are held by contract code, not any operator key: only the bound
wallet can withdraw a handle's balance, and a handle can be bound only once.

## Testnet

- Contract ID: `CBSXW5GK63I52OBERMKMF4L7ITRM5LD2HDEU7N2L3K3NFUSB4EO4NFX3`
- Token (native XLM SAC): `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- Admin / attestor: `parbeam-deployer` (binds handle → wallet after off-chain channel-ownership proof)
- Network: Test SDF Network ; September 2015

Verified live end to end: escrow (tip to unbound handle) → bind (set_payout) →
claim, plus direct routing (tip to a bound handle goes straight to the wallet).

## Interface

- `tip(from, handle, amount)` — viewer authorizes; routes to the bound wallet or escrows.
- `set_payout(handle, wallet)` — admin binds a handle once (immutable); moves no funds.
- `claim(handle)` — bound wallet withdraws its escrowed balance.
- `balance(handle) -> i128`, `payout(handle) -> Option<Address>` — views.
- Events: `TipEvent { from, handle, amount, direct }`, `ClaimEvent { handle, wallet, amount }`.

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
