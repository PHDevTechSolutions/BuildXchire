// pages/api/Backend/Reviews/fetch.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function fetchReviews(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sku } = req.query;

  if (!sku || typeof sku !== "string") {
    return res.status(400).json({ error: "ProductSku is required as 'sku' query param" });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Reviews");

    // Find reviews for the exact ProductSku, sorted by newest first
    const reviews = await collection
      .find({ ProductSku: sku })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Fetch reviews error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
