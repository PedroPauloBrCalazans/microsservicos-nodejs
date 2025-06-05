import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//toda vez que criamos uma aplicação com Escalonamento horizontal ou DEPLOY: Blue-green deployment precisamos de uma rota de health check -> verifica se a aplicação está funcionando, verifica se o serviço do NODE está no ar e respondendo em tempo

app.get("/health", () => {
  return "ok";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.number(),
      }),
    },
  },
  (request, response) => {
    const { amount } = request.body;

    console.log("Create an order with amount", amount);

    return response.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[Orders] HTTP Server running!");
});
