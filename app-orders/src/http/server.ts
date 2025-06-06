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
  (request, response) => {
    const { amount } = request.body;

    console.log("Create an order with amount", amount);

    channels.orders.sendToQueue(
      "orders",
      Buffer.from(JSON.stringify({ amount }))
    );

    return response.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[Orders] HTTP Server running!");
});
