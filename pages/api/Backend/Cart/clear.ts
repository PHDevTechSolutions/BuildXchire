// app/api/Backend/Cart/clear.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function clearCart(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE")
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Cart");

    // Delete all items in the cart
    const result = await collection.deleteMany({});

    res.status(200).json({
      message: `Cart cleared successfully (${result.deletedCount} items removed).`,
    });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}