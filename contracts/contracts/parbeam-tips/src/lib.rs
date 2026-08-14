#![no_std]

//! Parbeam tips: a non-custodial escrow + routing contract for streamer tips.
//!
//! A viewer tips a streamer by handle. If the handle is already bound to a
//! streamer wallet, the tip routes straight there (pure passthrough, the
//! contract never holds it). If the handle is not bound yet, the tip is held
//! in the contract and released the moment the streamer's wallet is bound and
//! they claim. The contract holds funds by code, not any operator key: only
//! the bound wallet can ever withdraw a handle's balance.

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, token, Address, Env, String,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AmountTooLow = 1,
    AlreadyBound = 2,
    NotBound = 3,
    NothingToClaim = 4,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Token,
    Payout(String),  // handle -> streamer wallet (once bound, immutable)
    Balance(String), // handle -> escrowed balance
}

const DAY_TTL: u32 = 17_280; // ~1 day at 5s ledgers
const KEEP_TTL: u32 = 518_400; // ~30 days

/// A tip landed for a handle. `direct` = routed straight to the streamer;
/// otherwise it was escrowed until the streamer binds their wallet.
/// `reference` links to the off-chain donor name + message (empty if none).
#[contractevent(topics = ["tip"])]
pub struct TipEvent {
    pub from: Address,
    pub handle: String,
    pub amount: i128,
    pub direct: bool,
    pub reference: String,
}

/// An escrowed balance was released to the streamer's wallet.
#[contractevent(topics = ["claim"])]
pub struct ClaimEvent {
    pub handle: String,
    pub wallet: Address,
    pub amount: i128,
}

#[contract]
pub struct ParbeamTips;

#[contractimpl]
impl ParbeamTips {
    /// admin: the attestor that binds handles to wallets after off-chain
    /// channel-ownership verification. token: the SAC token used for tips.
    pub fn __constructor(env: Env, admin: Address, token: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
    }

    /// Tip a streamer by handle. Routes straight to the streamer if bound,
    /// otherwise escrows in the contract. `reference` is an opaque id that
    /// links the tip to its off-chain donor name + message.
    pub fn tip(
        env: Env,
        from: Address,
        handle: String,
        amount: i128,
        reference: String,
    ) -> Result<(), Error> {
        from.require_auth();
        if amount <= 0 {
            return Err(Error::AmountTooLow);
        }
        let client = token::Client::new(&env, &Self::token(&env));

        match Self::payout(env.clone(), handle.clone()) {
            Some(wallet) => {
                client.transfer(&from, &wallet, &amount);
                TipEvent { from, handle, amount, direct: true, reference }.publish(&env);
            }
            None => {
                client.transfer(&from, &env.current_contract_address(), &amount);
                let bal = Self::balance(env.clone(), handle.clone())
                    .checked_add(amount)
                    .expect("overflow");
                let key = DataKey::Balance(handle.clone());
                env.storage().persistent().set(&key, &bal);
                env.storage().persistent().extend_ttl(&key, DAY_TTL, KEEP_TTL);
                TipEvent { from, handle, amount, direct: false, reference }.publish(&env);
            }
        }
        Ok(())
    }

    /// Bind a handle to a streamer wallet, once (immutable afterwards). Only
    /// the admin can bind, and only after verifying channel ownership
    /// off-chain. The admin cannot rebind or redirect an existing handle, and
    /// binding never moves funds: the streamer withdraws escrow via `claim`.
    pub fn set_payout(env: Env, handle: String, wallet: Address) -> Result<(), Error> {
        Self::admin(&env).require_auth();
        let pkey = DataKey::Payout(handle.clone());
        if env.storage().persistent().has(&pkey) {
            return Err(Error::AlreadyBound);
        }
        env.storage().persistent().set(&pkey, &wallet);
        env.storage().persistent().extend_ttl(&pkey, DAY_TTL, KEEP_TTL);
        Ok(())
    }

    /// Streamer withdraws the escrowed balance for their bound handle.
    pub fn claim(env: Env, handle: String) -> Result<(), Error> {
        let wallet = Self::payout(env.clone(), handle.clone()).ok_or(Error::NotBound)?;
        wallet.require_auth();
        let bal = Self::balance(env.clone(), handle.clone());
        if bal <= 0 {
            return Err(Error::NothingToClaim);
        }
        let client = token::Client::new(&env, &Self::token(&env));
        client.transfer(&env.current_contract_address(), &wallet, &bal);
        env.storage()
            .persistent()
            .set(&DataKey::Balance(handle.clone()), &0i128);
        ClaimEvent { handle, wallet, amount: bal }.publish(&env);
        Ok(())
    }

    // ---- views ----

    pub fn balance(env: Env, handle: String) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(handle))
            .unwrap_or(0)
    }

    pub fn payout(env: Env, handle: String) -> Option<Address> {
        env.storage().persistent().get(&DataKey::Payout(handle))
    }

    // ---- internals ----

    fn admin(env: &Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }

    fn token(env: &Env) -> Address {
        env.storage().instance().get(&DataKey::Token).unwrap()
    }
}

mod test;
