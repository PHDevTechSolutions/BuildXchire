// app/api/Backend/Cart/delete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function deleteCartItem(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const db = await connectToDatabase();
    const collection = db.collection("Cart");

    await collection.deleteOne({ _id: new (require("mongodb").ObjectId)(id) });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Delete cart item error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
