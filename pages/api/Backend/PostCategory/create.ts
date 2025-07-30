import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("postcategory");

    const {
      CategoryName, Slug, Description, Thumbnail, ReferenceID, createdBy
    } = req.body;

    if (!CategoryName || !Slug) {
      return res.status(400).json({ error: "Missing required fields: name, description, or price." });
    }

    const category = {
      CategoryName,
      Slug,
      Description,
      Thumbnail,
      ReferenceID: ReferenceID || "",
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { insertedId } = await collection.insertOne(category);

    res.status(201).json({ message: "Category created", id: insertedId });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
