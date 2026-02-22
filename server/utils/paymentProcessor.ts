import { metalPrices, orders, payments, schemes } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "server/db";
import { sendOrderPaidMail } from "./sendMail";

export async function processPayment(paymentId: any, razorpaySignature: any, razorpayPaymentId: any) {
  await db.transaction(async (tx) => {

    const payment = await tx.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });

    if (!payment) throw new Error("Payment not found");

    // 🔁 Idempotency check
    if (payment.processed) return;

    // Mark payment as processed
    await tx.update(payments).set({
        status:"paid",
        razorpayPaymentId:razorpayPaymentId,
        razorpaySignature:razorpaySignature,
        processed:true,
        updatedAt: new Date(),
    }).where(eq(payments.id, payment.id));

    // 🔹 BUSINESS LOGIC
    if (payment.entityType === "scheme") {
      const scheme = await tx.query.schemes.findFirst({
        where: eq(schemes.id, Number(payment.entityId)),
      });
      if (!scheme) throw new Error("Scheme not found");
      const goldRate = await tx.query.metalPrices.findFirst({
        where: eq(metalPrices.metal, "gold"),
      });
      const ratePerGram = Number(goldRate?.pricePerGram);
      const grams = Number(payment.amount) / ratePerGram;
      await tx.update(schemes)
        .set({
          totalPaid: sql`${schemes.totalPaid} + ${payment.amount}`,
          totalGoldGrams: sql`${schemes.totalGoldGrams} + ${grams}`,
          updatedAt: new Date(),
        })
        .where(eq(schemes.id, scheme.id));
    }
    else {
      const order = await tx.query.orders.findFirst({
        where: eq(orders.id, payment.entityId),
      });

      if (!order) throw new Error("Order not found");
      await tx.update(orders).set({
        status:"paid",
        updatedAt:new Date(),
      }).where(eq(orders.id, payment.entityId));
      await sendOrderPaidMail(order.id);
    }

  });
}
