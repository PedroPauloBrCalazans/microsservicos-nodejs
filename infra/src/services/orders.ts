import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

import { cluster } from "../cluster";
import { rabbitMQAdminHttpListener } from "./rabbitmq";
import { ordersDockerImage } from "../images/orders";

export const ordersService = new awsx.classic.ecs.FargateService(
  "fargate-orders",
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      container: {
        image: ordersDockerImage.ref,
        cpu: 256,
        memory: 512,
        environment: [
          {
            name: "BROKER_URL",
            value: pulumi.interpolate`amqp://admin:admin@${rabbitMQAdminHttpListener.endpoint.hostname}:${rabbitMQAdminHttpListener.endpoint.port}`,
          },
        ],
      },
    },
  }
);

//ECS + FARGATE => FAZER O DEPLOY
