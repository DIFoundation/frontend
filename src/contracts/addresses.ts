export const CONTRACT_ADDRESSES = {
  celo: {
    AMBIENCE_CHAT: "0x23cdaec75b1c3e5d26db4675ecb3c9042a780a0e",
  },
  celoSepolia: {
    AMBIENCE_CHAT: "0x23cdaec75b1c3e5d26db4675ecb3c9042a780a0e",
  },
  localhost: {
    AMBIENCE_CHAT: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
} as const;

export type Network = keyof typeof CONTRACT_ADDRESSES;
