import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//toda vez que criamos uma aplicação com Escalonamento horizontal ou DEPLOY: Blue-green deployment precisamos de uma rota de health check -> verifica se a aplicação está funcionando, verifica se o serviço do NODE está no ar e respondendo em tempo

app.register(fastifyCors, { origin: "*" });

app.get("/health", () => {
  return "ok";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, response) => {
    const { amount } = request.body;

    console.log("Create an order with amount", amount);

    const orderId = randomUUID();

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: "81360b12-3eef-4ebd-ae5e-d32b9ac87788",
      },
    });

    try {
      await db.insert(schema.orders).values({
        id: orderId,
        customerId: "81360b12-3eef-4ebd-ae5e-d32b9ac87788",
        amount,
      });

      return response.status(201).send();
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      return response.status(500).send({
        message: "Erro ao criar pedido",
        error: (err as Error).message,
      });
    }
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[Orders] HTTP Server running!");
});
