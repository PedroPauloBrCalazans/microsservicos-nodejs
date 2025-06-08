import * as pulumi from "@pulumi/pulumi";

import { ordersService } from "./src/services/orders";
import { kongService } from "./src/services/kong";
import { rabbitMQService } from "./src/services/rabbitmq";
import { appLoadBalancer } from "./src/load-balancer";

export const ordersId = ordersService.service.id;
export const rabbitMQId = rabbitMQService.service.id;
export const kongId = kongService.service.id;
export const rabbitMQAdmin = pulumi.interpolate`http://${appLoadBalancer.listeners[0].endpoint.hostname}:15672`;
