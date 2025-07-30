import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createTag(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("tag");

    const {
      TagName, Slug, Description, Thumbnail, ReferenceID, createdBy
    } = req.body;

    if (!TagName || !Slug) {
      return res.status(400).json({ error: "Missing required fields: name, description, or price." });
    }

    const brand = {
      TagName,
      Slug,
      Description,
      Thumbnail,
      ReferenceID: ReferenceID || "",
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { insertedId } = await collection.insertOne(brand);

    res.status(201).json({ message: "Tag created", id: insertedId });
  } catch (error) {
    console.error("Create tag error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
