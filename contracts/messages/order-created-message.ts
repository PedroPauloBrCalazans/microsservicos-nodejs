export interface OrderCreatedMessage {
  orderId: string;
  amount: number;
  customer: {
    id: string;
  };
}

//toda vez que o pedido for criado
