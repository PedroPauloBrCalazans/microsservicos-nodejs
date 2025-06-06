import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { pgEnum, text } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "canceled",
]);

export const orders = pgTable("orders", {
  id: text().primaryKey(),
  customerId: text().notNull(),
  amount: integer().notNull(),
  status: orderStatusEnum().notNull().default("pending"),
  createdAt: timestamp().defaultNow().notNull(),
});
