import * as awsx from "@pulumi/awsx";

export const cluster = new awsx.classic.ecs.Cluster("app-cluster");

//engloba todos os serviços que a minha aplicação está rodando
