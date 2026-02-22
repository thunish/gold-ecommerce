import { pgTable, text, serial, timestamp, uuid, jsonb, numeric, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { number, z } from "zod";

export const schemeStatusEnum = pgEnum("scheme_status", [
  "active",
  "redeem_requested",
  "redeemed",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firebaseUid:text("firebase_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders=pgTable("orders", {
  id:uuid("id").defaultRandom().primaryKey(),
  userId:uuid("user_id").references(()=>users.id, {onDelete:"set null"}),
  status:text("status").default("pending").notNull(),  // pending | paid | shipped | delivered | cancelled
  products:jsonb("products").notNull(),
  totalAmount:numeric("total_amount", {precision:10, scale:2}).notNull(),
  createdAt:timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().notNull()
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  metalType: text("metal_type").notNull(), // 'gold' or 'silver'
  grams: text("grams").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  quantity:integer("quantity").notNull().default(1),
  // price:numeric("price", {precision:10, scale:2}).notNull().default(0),
  category: text("category").notNull(), // 'gold' or 'silver'
  imageUrl: text("image_url").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const metalPrices = pgTable("metal_prices", {
  id: serial("id").primaryKey(),
  metal: text("metal").notNull().unique(), // 'gold' | 'silver'
  pricePerGram: numeric("price_per_gram", {
    precision: 10,
    scale: 2,
  }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  targetAmount: numeric("target_amount", { precision: 12, scale: 2 })
    .notNull(),
  totalPaid: numeric("total_paid", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  totalGoldGrams: numeric("total_gold_grams", {
    precision: 12,
    scale: 4, // allow decimals like 1.2345g
  })
    .default("0")
    .notNull(),
  status: schemeStatusEnum("status")
    .default("active")
    .notNull(),
  redeemAddress: text("redeem_address"),
  redeemRequestedAt: timestamp("redeem_requested_at"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  entityType: text("entity_type").notNull(), 
  entityId: text("entity_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("INR").notNull(),
  razorpayOrderId: text("razorpay_order_id").unique(),
  razorpayPaymentId: text("razorpay_payment_id").unique(),
  razorpaySignature: text("razorpay_signature"),
  status: text("status").default("created").notNull(),
  // created | paid | failed | refunded
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});


export const insertBookingSchema = createInsertSchema(bookings).pick({
  name: true,
  email: true,
  phoneNumber: true,
  address: true,
  metalType: true,
  grams: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Please provide a more detailed address"),
  grams: z.string().min(1, "Weight in grams is required"),
});

export const insertUserSchema=createInsertSchema(users).pick({
  firebaseUid:true,
  name:true,
  email:true
});

export const insertOrderSchema=createInsertSchema(orders).pick({
  userId:true,
  products:true,
  totalAmount:true
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Product = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  imageUrl: string;
  price: number; 
};
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser=z.infer<typeof insertUserSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type MetalPrices = typeof metalPrices.$inferSelect;
