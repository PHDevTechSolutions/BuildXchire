import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end(`Method ${req.method} Not Allowed`);

    try {
        const db = await connectToDatabase();
        const collection = db.collection("posts");

        const {
            PostTitle, PostDescription, PostStatus, Slug, Author, PostCategory, PostTags, FeaturedImage, 
            SEOKeywords, SEOTitle, SEOSlug, CanonicalURL, BreadcrumbsTitle, ReferenceID, createdBy
        } = req.body;

        if (!PostTitle || !Slug) {
            return res.status(400).json({ error: "Missing required fields: name, description, or price." });
        }

        const brand = {
            PostTitle,
            PostDescription,
            PostStatus,
            Slug,
            Author,
            PostCategory,
            PostTags,
            FeaturedImage,
            SEOKeywords,
            SEOTitle,
            SEOSlug,
            CanonicalURL,
            BreadcrumbsTitle,
            ReferenceID: ReferenceID || "",
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const { insertedId } = await collection.insertOne(brand);

        res.status(201).json({ message: "Post created", id: insertedId });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
