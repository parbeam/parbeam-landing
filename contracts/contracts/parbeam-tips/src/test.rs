#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, token, Address, Env, String};

struct Fixture<'a> {
    env: Env,
    client: ParbeamTipsClient<'a>,
    token: token::Client<'a>,
    token_admin: token::StellarAssetClient<'a>,
}

fn setup<'a>() -> Fixture<'a> {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let token_addr = sac.address();

    let contract_id = env.register(ParbeamTips, (admin.clone(), token_addr.clone()));

    Fixture {
        token: token::Client::new(&env, &token_addr),
        token_admin: token::StellarAssetClient::new(&env, &token_addr),
        client: ParbeamTipsClient::new(&env, &contract_id),
        env,
    }
}

#[test]
fn escrow_then_bind_then_claim() {
    let f = setup();
    let viewer = Address::generate(&f.env);
    let streamer = Address::generate(&f.env);
    f.token_admin.mint(&viewer, &1000);
    let handle = String::from_str(&f.env, "my-stream");

    // tip to an unbound handle -> escrowed in the contract
    let r = String::from_str(&f.env, "pb_ref1");
    f.client.tip(&viewer, &handle, &100, &r);
    assert_eq!(f.client.balance(&handle), 100);
    assert_eq!(f.token.balance(&viewer), 900);
    assert_eq!(f.client.payout(&handle), None);

    // a second tip accumulates
    f.client.tip(&viewer, &handle, &50, &r);
    assert_eq!(f.client.balance(&handle), 150);

    // admin binds the handle to the streamer wallet (after off-chain proof)
    f.client.set_payout(&handle, &streamer);
    assert_eq!(f.client.payout(&handle), Some(streamer.clone()));
    assert_eq!(f.client.balance(&handle), 150); // binding does not move funds

    // streamer claims the escrow
    f.client.claim(&handle);
    assert_eq!(f.client.balance(&handle), 0);
    assert_eq!(f.token.balance(&streamer), 150);
}

#[test]
fn bound_handle_routes_direct() {
    let f = setup();
    let viewer = Address::generate(&f.env);
    let streamer = Address::generate(&f.env);
    f.token_admin.mint(&viewer, &1000);
    let handle = String::from_str(&f.env, "live");

    f.client.set_payout(&handle, &streamer);
    f.client.tip(&viewer, &handle, &200, &String::from_str(&f.env, "pb_ref2"));

    // routed straight through: nothing held by the contract
    assert_eq!(f.client.balance(&handle), 0);
    assert_eq!(f.token.balance(&streamer), 200);
    assert_eq!(f.token.balance(&viewer), 800);
}

#[test]
fn rebinding_is_rejected() {
    let f = setup();
    let s1 = Address::generate(&f.env);
    let s2 = Address::generate(&f.env);
    let handle = String::from_str(&f.env, "handle");
    f.client.set_payout(&handle, &s1);
    let res = f.client.try_set_payout(&handle, &s2);
    assert_eq!(res, Err(Ok(Error::AlreadyBound)));
    assert_eq!(f.client.payout(&handle), Some(s1));
}

#[test]
fn claim_without_binding_is_rejected() {
    let f = setup();
    let res = f.client.try_claim(&String::from_str(&f.env, "nobody"));
    assert_eq!(res, Err(Ok(Error::NotBound)));
}

#[test]
fn claim_with_empty_escrow_is_rejected() {
    let f = setup();
    let streamer = Address::generate(&f.env);
    let handle = String::from_str(&f.env, "empty");
    f.client.set_payout(&handle, &streamer);
    let res = f.client.try_claim(&handle);
    assert_eq!(res, Err(Ok(Error::NothingToClaim)));
}

#[test]
fn zero_tip_is_rejected() {
    let f = setup();
    let viewer = Address::generate(&f.env);
    f.token_admin.mint(&viewer, &10);
    let res = f.client.try_tip(&viewer, &String::from_str(&f.env, "h"), &0, &String::from_str(&f.env, "x"));
    assert_eq!(res, Err(Ok(Error::AmountTooLow)));
}
