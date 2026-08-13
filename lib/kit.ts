// Browser-only Stellar Wallets Kit helper. Imported from client components only.
// The kit is a static singleton; init runs once.
let kitReady: Promise<{ StellarWalletsKit: any; Networks: any }> | null = null;

export async function ensureKit() {
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

export async function connectWallet(): Promise<string> {
  const { StellarWalletsKit } = await ensureKit();
  const { address } = await StellarWalletsKit.authModal();
  return address;
}

export async function signTransactionXdr(xdr: string, address: string): Promise<string> {
  const { StellarWalletsKit, Networks } = await ensureKit();
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    address,
    networkPassphrase: Networks.TESTNET,
  });
  return signedTxXdr;
}
