interface OrderParams {
  tokenMint: string;
  side: "buy" | "sell";
  price: number;
  size: number;
}

export const placeOrder = async (params: OrderParams) => {
  // TODO: Implement actual Jupiter/Serum DEX integration
  console.log("Placing order:", params);
  return Promise.resolve("mock_tx_id");
};
