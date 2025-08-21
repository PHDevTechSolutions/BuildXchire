import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createReview(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") 
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const { Name, Rating, Comment, ProductSku, ProductName } = req.body;

    if (!Name || !Comment || !ProductSku || !ProductName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = await connectToDatabase();
    const collection = db.collection("Reviews");

    const review = {
      Name,
      Rating: parseInt(Rating) || 0,
      Comment,
      ProductSku,
      ProductName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await collection.insertOne(review);

    res.status(201).json({ message: "Review created", id: insertedId });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
