import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createCheckout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("checkout");

    const {
      FullName,
      Email,
      Phone,
      Address,
      PaymentMethod,
      CartItems,
      TotalAmount,
      ReferenceID = null, // optional
      userId = null,      // optional
    } = req.body;

    if (!FullName || !Email || !Phone || !Address || !CartItems || CartItems.length === 0) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const order = {
      FullName,
      Email,
      Phone,
      Address,
      PaymentMethod,
      CartItems,
      TotalAmount,
      ReferenceID, // store ReferenceID if available
      userId,      // store userId if available
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await collection.insertOne(order);

    // Return full order info
    res.status(201).json({ ...order, id: insertedId });
  } catch (error) {
    console.error("Create checkout error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
