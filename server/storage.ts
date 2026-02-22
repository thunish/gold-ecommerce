import { bookings, products, type Booking, type InsertBooking, type Product, type InsertProduct, InsertUser, users, metalPrices } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  seedProducts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<any> {
    const result=await db.select({
      id:products.id,
      name:products.name,
      description: products.description,
      quantity: products.quantity,
      category: products.category,
      imageUrl: products.imageUrl,
      price:sql<number>`${products.quantity} * ${metalPrices.pricePerGram}`.as("price")
    })
    .from(products).innerJoin(metalPrices, eq(products.category, metalPrices.metal));
    return result;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }
  
  async createUser(insertUser: InsertUser){
    const [user]=await db.insert(users).values(insertUser).returning();
    return user;
  }

  async seedProducts(): Promise<void> {
    const existing = await db.select().from(products);
    if (existing.length === 0) {
      await db.insert(products).values([
        {
          name: "Gold",
          description: "10 గ్రాములు",
          category: "gold",
          imageUrl: "/images/gold-10g.jpg"
        },
        {
          name: "Silver",
          description: "1 కిలో",
          category: "silver",
          imageUrl: "/images/silver-100g.jpg"
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
