// app/api/Backend/Cart/fetch.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function fetchCart(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Cart");

    const cartItems = await collection.find({}).toArray();

    res.status(200).json({ data: cartItems });
  } catch (err) {
    console.error("Fetch cart error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
