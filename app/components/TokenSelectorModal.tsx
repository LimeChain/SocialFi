import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import { useTokenStore, Token } from "@/app/stores/TokenStore";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  excludeToken?: Token | null;
}

export default function TokenSelectorModal({
  visible,
  onClose,
  onSelect,
  excludeToken,
}: Props) {
  const { tokens, popularTokens, loading, fetchTokens } = useTokenStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible && tokens.length === 0) {
      fetchTokens();
    }
  }, [visible]);

  const filteredTokens = tokens.filter((token) => {
    if (excludeToken && token.address === excludeToken.address) return false;

    const searchLower = searchQuery.toLowerCase();
    return (
      token.symbol.toLowerCase().includes(searchLower) ||
      token.name.toLowerCase().includes(searchLower) ||
      token.address.toLowerCase().includes(searchLower)
    );
  });

  const renderToken = ({ item }: { item: Token }) => (
    <TouchableOpacity
      style={styles.tokenItem}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      {item.logoURI ? (
        <Image source={{ uri: item.logoURI }} style={styles.tokenLogo} />
      ) : (
        <View style={styles.tokenLogoPlaceholder} />
      )}
      <View style={styles.tokenInfo}>
        <Text style={styles.tokenSymbol}>{item.symbol}</Text>
        <Text style={styles.tokenName}>{item.name}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.tokenBalance}>
          {useTokenStore.getState().getFormattedBalance(item)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Token</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search name or paste address"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {popularTokens.length > 0 && searchQuery.length === 0 && (
            <>
              <Text style={styles.sectionTitle}>Popular Tokens</Text>
              <FlatList
                data={popularTokens}
                renderItem={renderToken}
                keyExtractor={(item) => item.address}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.popularList}
              />
            </>
          )}

          <FlatList
            data={filteredTokens}
            renderItem={renderToken}
            keyExtractor={(item) => item.address}
            style={styles.tokenList}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 10,
  },
  popularList: {
    maxHeight: 80,
    marginBottom: 20,
  },
  tokenList: {
    maxHeight: "60%",
  },
  tokenItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    justifyContent: "space-between",
  },
  tokenLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tokenLogoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  tokenInfo: {
    marginLeft: 12,
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: "600",
  },
  tokenName: {
    fontSize: 14,
    color: "#666",
  },
  balanceContainer: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  tokenBalance: {
    fontSize: 14,
    color: "#666",
  },
});
