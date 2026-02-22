import { orders, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";
import { db } from "server/db";

const transporter = nodemailer.createTransport({
    service: "gmail", // simplest option
    auth: {
    user: process.env.ADMIN_EMAIL,      // your gmail
    pass: process.env.ADMIN_EMAIL_PASS, // app password
    },
});

export async function sendRedeemMail(data: {
  userEmail: string;
  schemeId: number;
  totalPaid:string
  totalGold: string;
  address: string;
}) {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL, // admin receives
        subject: "New Gold Redeem Request",
        html: `
        <h2>🟡 New Gold Redeem Request</h2>
        <p><strong>User Email:</strong> ${data.userEmail}</p>
        <p><strong>Scheme ID:</strong> ${data.schemeId}</p>
        <p><strong>Total Amount paid:</strong> ${data.totalPaid}</p>
        <p><strong>Total Gold:</strong> ${data.totalGold} grams</p>
        <p><strong>Delivery Address:</strong></p>
        <p>${data.address}</p>
        `,
    };
    await transporter.sendMail(mailOptions);
}

export async function sendOrderPaidMail(orderId: string) {
  // 🔎 Fetch order
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) throw new Error("Order not found");

  // 🔎 Fetch user
  const user = await db.query.users.findFirst({
    where: eq(users.id, order?.userId || ""),
  });

  if (!user?.email) throw new Error("User email not found");

  const products = order.products as any[];

  /* ---- Build Product Table ---- */
  const productRows = products
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${
            Number(item.price) * Number(item.quantity)
          }</td>
        </tr>
      `
    )
    .join("");

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL, // ✅ customer receives
    subject: "🎉 Order Confirmed - Payment Successful",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2e7d32;">✅ Payment Successful</h2>
        <p>Hello ${user.name || "Customer"},</p>
        <p>Your order has been successfully placed and paid.</p>

        <h3>🧾 Order Details</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Status:</strong> ${order.status}</p>

        <h3>🛒 Products</h3>
        <table style="border-collapse: collapse; width: 100%; margin-top:10px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px;border:1px solid #ddd;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
              <th style="padding:8px;border:1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <br/>
        <p>We will notify you once your order is shipped.</p>
        <p>Thank you for shopping with us 🙏</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

