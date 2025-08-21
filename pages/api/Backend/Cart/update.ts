// app/api/Backend/Cart/update.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function updateCart(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { id, quantity, totalPrice } = req.body;

    if (!id || quantity === undefined || totalPrice === undefined) {
      return res.status(400).json({ error: "Missing required fields: id, quantity, or totalPrice" });
    }

    const db = await connectToDatabase();
    const collection = db.collection("Cart");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          Quantity: Number(quantity),
          ProductPrice: Number(totalPrice),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
