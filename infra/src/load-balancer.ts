import * as awsx from "@pulumi/awsx";
import { cluster } from "./cluster";

export const appLoadBalancer = new awsx.classic.lb.ApplicationLoadBalancer(
  "app-lb",
  {
    securityGroups: cluster.securityGroups,
  }
);

//securityGroups => É usado com HTTP uma forma de determinar qual serviço enxerga qual serviço

export const networkLoadBalancer = new awsx.classic.lb.NetworkLoadBalancer(
  "net-lb",
  {
    subnets: cluster.vpc.publicSubnetIds,
  }
);

//subnets => não usa HTTP
