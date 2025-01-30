import React, { useState, useEffect } from "react";
import { View, Text, Modal, FlatList, Image } from "react-native";
import { useTokenStore, Token } from "@/app/stores/TokenStore";
import { SearchBar } from "./ui/SearchBar";
import { Card } from "./ui/Card";
import { AnimatedPressable } from "./ui/AnimatedPressable";
import { IconButton } from "./ui/IconButton";

interface TokenSelectProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  excludeToken?: Token | null;
}

export const TokenSelect = ({
  visible,
  onClose,
  onSelect,
  excludeToken,
}: TokenSelectProps) => {
  const { tokens, popularTokens, loading, fetchTokens } = useTokenStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible && tokens.length === 0) {
      fetchTokens();
    }
  }, [visible]);

  const filteredTokens = tokens.filter((token) => {
    if (excludeToken && token.address === excludeToken.address) return false;

    if (searchQuery === "") return true;

    return (
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderTokenItem = ({ item }: { item: Token }) => (
    <AnimatedPressable
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Card className="flex-row items-center p-4">
        {item.logoURI ? (
          <Image
            source={{ uri: item.logoURI }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-200" />
        )}
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-text-primary">
            {item.symbol}
          </Text>
          <Text className="text-sm text-text-secondary">{item.name}</Text>
        </View>
      </Card>
    </AnimatedPressable>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-text-primary">
            Select Token
          </Text>
          <IconButton
            name="close-outline"
            variant="ghost"
            size="sm"
            onPress={onClose}
          />
        </View>

        <SearchBar
          className="mx-4 mt-4"
          placeholder="Search tokens..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        {popularTokens.length > 0 && searchQuery === "" && (
          <>
            <Text className="text-base font-semibold text-text-primary px-4 mt-6 mb-2">
              Popular Tokens
            </Text>
            <FlatList
              data={popularTokens.filter(
                (token) =>
                  !excludeToken || token.address !== excludeToken.address
              )}
              renderItem={renderTokenItem}
              keyExtractor={(item) => item.address}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            />
          </>
        )}

        <Text className="text-base font-semibold text-text-primary px-4 mt-6 mb-2">
          All Tokens
        </Text>
        <FlatList
          data={filteredTokens}
          renderItem={renderTokenItem}
          keyExtractor={(item) => item.address}
          className="flex-1 px-4"
          contentContainerStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};
