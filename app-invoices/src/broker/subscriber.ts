import { orders } from "./channels/orders.ts";

orders.consume(
  "orders",
  async (message) => {
    if (!message) {
      return null;
    }

    console.log(message?.content.toString());

    orders.ack(message);
  },
  {
    noAck: false,
  }
);

// noAck => acknowledge => reconhecer, dizer que a msg foi recebida com sucesso
