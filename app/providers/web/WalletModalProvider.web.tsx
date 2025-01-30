import { FC, ReactNode } from "react";
import { WalletModalProvider as WebWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => <WebWalletModalProvider>{children}</WebWalletModalProvider>;
