import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { string, z } from "zod";
import { db } from "./db";
import { metalPrices, schemes, users, payments, orders } from "@shared/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { sendOrderPaidMail, sendRedeemMail } from "./utils/sendMail";
import { razorpay } from "./lib/razorpay";
import crypto from "crypto";
import { processPayment } from "./utils/paymentProcessor";
import express from "express";


async function getUserByFirebaseId(firId: string){
  const user = await db.query.users.findFirst({
    where: eq(users.firebaseUid, firId),
  });
  if(!user){
    throw new Error("User not found");
  }
  return user;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post(api.bookings.create.path, async (req, res) => {
    try {
      console.log(req.body);
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.users.create.path, async(req, res)=>{
    try{
      const input=api.users.create.input.parse(req.body);
      const user=await storage.createUser(input);
      res.status(201).json(user);
    }
    catch(err){
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error while user creation" });
      }
    }
  });

  app.get("/api/rates", async (req, res) => {
    try{
      const rates = await db.select().from(metalPrices);
      res.status(200).json(rates);
    }
    catch(err){
      res.status(500).json({
        msg:"There is some error while gettin routes",
        error:err
      })

    }
  });

  app.post("/api/scheme/create", async(req, res)=>{ // create a scheme
    try{
      const {firId}=req.body;
      const {targetAmount}=req.body;
      if(!firId || !targetAmount){
        return res.status(400).json({
          message:"Missing data"
        });
      }
      const user=await getUserByFirebaseId(firId);
      const scheme = await db.insert(schemes).values({
        userId: user.id,
        targetAmount,
        totalPaid: "0",
        totalGoldGrams: "0",
        status: "active",
      }).returning();
      res.status(201).json(scheme[0]);
    }
    catch(err){
      res.status(500).json({
        msg:"Internal server error while creating a scheme",
        error:err,
      });
    }
  })

  app.post("/api/scheme/details", async(req, res)=>{   //get single scheme details selected
    try {
      const { firebaseId, schemeId } = req.body;
      const user = await getUserByFirebaseId(firebaseId);
      const scheme = await db.query.schemes.findFirst({
        where: and(
          eq(schemes.id, schemeId),
          eq(schemes.userId, user.id)
        ),
        with: {
          // payments: true,
        },
      });

      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }

      res.json(scheme);

    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  })

  app.post("/api/schemes/list", async (req, res) => { //get user schemes list
    try {
      const { firebaseId } = req.body;

      const user = await getUserByFirebaseId(firebaseId);

      const userSchemes = await db.query.schemes.findMany({
        where: eq(schemes.userId, user.id),
        orderBy: desc(schemes.createdAt),
      });

      res.json(userSchemes);

    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/schemes/redeem", async(req, res)=>{  //redeem a prticular scheme
    try {
      const { firebaseId, schemeId, address } = req.body;
      if (!firebaseId || !schemeId || !address) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }
      const user = await getUserByFirebaseId(firebaseId);
      const scheme = await db.query.schemes.findFirst({
        where: and(
          eq(schemes.id, schemeId),
          eq(schemes.userId, user.id)
        ),
      });
      if (!scheme) {
        return res.status(404).json({
          message: "Scheme not found",
        });
      }
      if (scheme.status === "redeemed") {
        return res.status(400).json({
          message: "Scheme is not eligible for redeem",
        });
      }
      if (Number(scheme.totalPaid) < Number(scheme.targetAmount)) {
        return res.status(400).json({
          message: "Target amount not completed",
        });
      }
      await db.update(schemes)
        .set({
          status: "redeem_requested",
          redeemAddress: address,
          redeemRequestedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schemes.id, schemeId));
      await sendRedeemMail({
        userEmail: user.email,
        schemeId: scheme.id,
        totalPaid:scheme.totalPaid,
        totalGold: scheme.totalGoldGrams,
        address,
      });
      res.json({
        success: true,
        message: "Redeem request submitted successfully",
      });

    } catch (err: any) {
      res.status(500).json({
        message: err.message,
      });
    }
  })

  app.post("/api/payments/create-order", async(req, res)=>{  //create a razorpay payment order
    try{
      const {firebaseId, entityType, entityId, amount}=req.body;
      if(!firebaseId || !entityId || !entityType || !amount){
        return res.status(400).json({message:"Missing data"});
      }
      const user=await getUserByFirebaseId(firebaseId);
      if (entityType === "scheme") {
        const scheme = await db.query.schemes.findFirst({
          where: and(
            eq(schemes.id, entityId),
            eq(schemes.userId, user.id),
            eq(schemes.status, "active")
          ),
        });

        if (!scheme) {
          return res.status(400).json({ message: "Invalid scheme" });
        }
      }
      else{
        const order=await db.query.orders.findFirst({
          where: and(
            eq(orders.id, entityId),
            eq(orders.userId, user.id),
            eq(orders.status, "pending")
          ),
        });
        if(!order){
          return res.status(400).json({message:"Invalid order"});
        }
      }
      const razorpayOrder=await razorpay.orders.create({
        amount: Number(amount) *100,
        currency:"INR",
        receipt:`receipt_${Date.now()}`
      });
      const payment=await db.insert(payments).values({
        userId:user.id,
        entityType,
        entityId,
        amount,
        razorpayOrderId:razorpayOrder.id,
        status:"created",
      }).returning();
      res.json({
        orderId: razorpayOrder.id,
        key: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        paymentId: payment[0].id,
      });
    }
    catch(err: any){
      res.status(500).json({ message: err });
    }
  });

  app.post("/api/payments/verify", async(req, res)=>{  //verify the razorpay payment order
    try{
      const{paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body;
      const payment=await db.query.payments.findFirst({
        where:eq(payments.id, paymentId)
      });
      if(!payment) return res.status(400).json({message:"Payment not found"});
      if (payment.razorpayOrderId !== razorpay_order_id) {
          return res.status(400).json({ message: "Order mismatch" });
        }

      const body=razorpay_order_id +"|"+razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }
      if (payment.processed) {
        return res.json({ message: "Already processed" });
      }
      await processPayment(paymentId, razorpay_signature, razorpay_payment_id);
      return res.status(200).json({
        success: true,
        message: "Payment verified and processed successfully",
      });
    }
    catch(err){
      return res.status(500).json({message:err});
    }
  });

  app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
  app.post("/api/payments/webhook", async(req, res)=>{   //razorpay webhook api
    try{
      const signature=req.headers["x-razorpay-signature"] as string;
      const body=req.body;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }
      const event=JSON.parse(body.toString());
      if(event.event==="payment.captured"){
        const razorpayOrderId = event.payload.payment.entity.order_id;

        // Find payment in DB
        const payment = await db.query.payments.findFirst({
          where: eq(payments.razorpayOrderId, razorpayOrderId),
        });
        if (!payment) {
          return res.status(404).json({ message: "Payment not found" });
        }
        await db.update(payments)
          .set({
            razorpayPaymentId: event.payload.payment.entity.id,
            updatedAt: new Date(),
          })
          .where(eq(payments.id, payment.id));
        // Process safely
        await processPayment(payment.id, signature, razorpayOrderId);
      }
      return res.status(200).json({ received: true });
    }
    catch (err: any) {
      console.error("Webhook error:", err);
      res.status(500).json({ message: "Webhook failed" });
    }
  });

  app.post("/api/orders/create", async(req, res)=>{  //create an order and store in db
    try{
      const {firebaseId, products}=req.body;
      const user=await getUserByFirebaseId(firebaseId);
      let total=0;
      for(const item of products){
        total+=(Number(item.price) * Number(item.quantity));
      }
      const order=await db.insert(orders).values({
        userId:user.id,
        products,
        totalAmount:total.toString(),
        status:"pending",
      }).returning();

      res.status(201).json(order[0]);
    }catch(err){
      console.log(err);
      return res.status(500).json({"message":err});
    }
  });

  // await storage.seedProducts();
  return httpServer;
}
