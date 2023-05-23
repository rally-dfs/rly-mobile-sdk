import { utils, Wallet } from 'ethers';
import { KeychainAccessibilityConstant, WHEN_UNLOCKED } from './keyManagerConstants';

type ExpoObject = {
  modules: undefined | { [key: string]: any };
};

declare global {
  var expo: ExpoObject | undefined;
  var ExpoModules: undefined | { [key: string]: any };
}

const LINKING_ERROR =
  "The package 'expo-secure-store' doesn't seem to be available please install it as a dependency if using expo.";


type SecureStoreOptions = {
  keychainService?: string;
  requireAuthentication?: boolean;
  authenticationPrompt?: string;
  keychainAccessible?: KeychainAccessibilityConstant;
};

let SecureStore: {
  getItemAsync: (mnemonic: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string, options: SecureStoreOptions) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};

if (global.expo?.modules || global.ExpoModules) {
  try {
    SecureStore = require('expo-secure-store');
  } catch (e) {
    throw new Error(LINKING_ERROR);
  }
} else {
  throw new Error(LINKING_ERROR);
}

const MNEMONIC_ACCOUNT_KEY = 'BIP39_MNEMONIC';

export const getMnemonic = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(MNEMONIC_ACCOUNT_KEY);
};

export const generateMnemonic = async (): Promise<string> => {
  return utils.entropyToMnemonic(utils.randomBytes(24));
};

export const saveMnemonic = async (mnemonic: string, keychainAccessible: KeychainAccessibilityConstant = WHEN_UNLOCKED): Promise<void> => {
  return SecureStore.setItemAsync(MNEMONIC_ACCOUNT_KEY, mnemonic, { keychainAccessible });
};

export const deleteMnemonic = async (): Promise<void> => {
  return SecureStore.deleteItemAsync(MNEMONIC_ACCOUNT_KEY);
};

export const getPrivateKeyFromMnemonic = async (
  mnemonic: string
): Promise<Uint8Array> => {
  return utils.arrayify(Wallet.fromMnemonic(mnemonic).privateKey);
};
