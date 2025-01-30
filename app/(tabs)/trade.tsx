import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Card } from "@/app/components/ui/Card";
import { useWalletStore } from "@/app/stores/WalletStore";
import { TokenSelect } from "@/app/components/TokenSelect";
import { useTokenStore } from "@/app/stores/TokenStore";
import { useJupiterStore } from "@/app/stores/JupiterStore";

interface Token {
  address: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export default function TradeScreen() {
  const { publicKey, connection, network } = useWalletStore();
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputToken, setInputToken] = useState<Token | null>(null);
  const [outputToken, setOutputToken] = useState<Token | null>(null);
  const [showInputTokenModal, setShowInputTokenModal] = useState(false);
  const [showOutputTokenModal, setShowOutputTokenModal] = useState(false);
  const {
    selectedInputToken,
    selectedOutputToken,
    setSelectedInputToken,
    setSelectedOutputToken,
    getFormattedBalance,
  } = useTokenStore();
  const {
    fetchRoutes,
    selectedRoute,
    executeSwap,
    loading: jupiterLoading,
    error: jupiterError,
  } = useJupiterStore();

  useEffect(() => {
    if (publicKey && connection) {
      useTokenStore.getState().fetchTokenBalances(connection, publicKey);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (
      selectedInputToken &&
      selectedOutputToken &&
      inputAmount &&
      Number(inputAmount) > 0
    ) {
      const amount = (
        Number(inputAmount) * Math.pow(10, selectedInputToken.decimals)
      ).toString();

      fetchRoutes(
        selectedInputToken.address,
        selectedOutputToken.address,
        amount
      );
    }
  }, [selectedInputToken, selectedOutputToken, inputAmount]);

  useEffect(() => {
    if (selectedRoute) {
      const outputDecimals = selectedOutputToken?.decimals || 9;
      const amount =
        Number(selectedRoute.outAmount) / Math.pow(10, outputDecimals);
      setOutputAmount(amount.toFixed(outputDecimals > 4 ? 4 : outputDecimals));
    } else {
      setOutputAmount("");
    }
  }, [selectedRoute, selectedOutputToken]);

  const priceImpactWarning = useMemo(() => {
    if (selectedRoute && selectedRoute.priceImpactPct > 1) {
      return `High price impact: ${selectedRoute.priceImpactPct.toFixed(2)}%`;
    }
    return null;
  }, [selectedRoute]);

  const handleSwap = async () => {
    if (!publicKey || !selectedInputToken || !selectedOutputToken) return;
    setLoading(true);
    try {
      const txid = await executeSwap();
      alert(`Transaction submitted: ${txid}`);
    } catch (error) {
      console.error("Swap failed:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-dark-surface">
      <View className="p-4">
        <Card>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
              Swap Tokens
            </Text>
          </View>
          <View style={styles.content}>
            {/* Input Token Selection */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.tokenButton}
                onPress={() => setShowInputTokenModal(true)}
              >
                <Text style={styles.tokenButtonText}>
                  {selectedInputToken?.symbol || "Select Token"}
                </Text>
              </TouchableOpacity>
              <View style={styles.balanceRow}>
                {selectedInputToken && (
                  <Text style={styles.balanceText}>
                    Balance: {getFormattedBalance(selectedInputToken)}
                  </Text>
                )}
              </View>
              <TextInput
                style={styles.input}
                value={inputAmount}
                onChangeText={setInputAmount}
                placeholder="0.0"
                keyboardType="decimal-pad"
              />
            </View>

            {/* Swap Direction Button */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={() => {
                const tempToken = selectedInputToken;
                setSelectedInputToken(selectedOutputToken);
                setSelectedOutputToken(tempToken);
              }}
            >
              <Text>↓</Text>
            </TouchableOpacity>

            {/* Output Token Selection */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.tokenButton}
                onPress={() => setShowOutputTokenModal(true)}
              >
                <Text style={styles.tokenButtonText}>
                  {selectedOutputToken?.symbol || "Select Token"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.outputAmount}>{outputAmount || "0.0"}</Text>
            </View>

            {/* Price Impact Warning */}
            {priceImpactWarning && (
              <Text style={styles.warningText}>{priceImpactWarning}</Text>
            )}

            {/* Jupiter Error */}
            {jupiterError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{jupiterError}</Text>
                {network === "devnet" && (
                  <TouchableOpacity
                    style={styles.networkSwitchButton}
                    onPress={() =>
                      useWalletStore.getState().setNetwork("mainnet-beta")
                    }
                  >
                    <Text style={styles.networkSwitchText}>
                      Switch to Mainnet
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Swap Button */}
            <TouchableOpacity
              style={[
                styles.swapActionButton,
                (!publicKey ||
                  !selectedInputToken ||
                  !selectedOutputToken ||
                  loading ||
                  jupiterLoading) &&
                  styles.disabled,
              ]}
              onPress={handleSwap}
              disabled={
                !publicKey ||
                !selectedInputToken ||
                !selectedOutputToken ||
                loading ||
                jupiterLoading
              }
            >
              {loading || jupiterLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.swapActionButtonText}>
                  {!publicKey
                    ? "Connect Wallet"
                    : !selectedInputToken || !selectedOutputToken
                    ? "Select Tokens"
                    : "Swap"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <TokenSelect
        visible={showInputTokenModal}
        onClose={() => setShowInputTokenModal(false)}
        onSelect={setSelectedInputToken}
        excludeToken={selectedOutputToken}
      />
      <TokenSelect
        visible={showOutputTokenModal}
        onClose={() => setShowOutputTokenModal(false)}
        onSelect={setSelectedOutputToken}
        excludeToken={selectedInputToken}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  tokenButton: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  tokenButtonText: {
    fontWeight: "600",
  },
  input: {
    fontSize: 24,
    marginTop: 10,
  },
  outputAmount: {
    fontSize: 24,
    marginTop: 10,
    color: "#666",
  },
  swapButton: {
    alignSelf: "center",
    padding: 10,
  },
  swapActionButton: {
    backgroundColor: "#512DA8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  swapActionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  balanceText: {
    fontSize: 12,
    color: "#666",
  },
  networkText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  warningText: {
    color: "#f1c40f",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    textAlign: "center",
  },
  networkSwitchButton: {
    marginTop: 8,
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  networkSwitchText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
