import { FC, ReactNode, useMemo } from "react";
import { Platform } from "react-native";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "./web/WalletModalProvider";

interface Props {
  children: ReactNode;
}

const WalletProvider: FC<Props> = ({ children }) => {
  const wallets = useMemo(
    () =>
      Platform.OS === "web"
        ? [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
        : [],
    []
  );

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
