import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createCart(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") 
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Cart");

    // Destructure ReferenceID from request body
    const { ProductName, ProductSKU, ProductImage, ProductPrice, Quantity, CartNumber, ReferenceID } = req.body;

    if (!ProductSKU || !ProductImage || !ProductPrice || !Quantity) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const cartItem = {
      CartNumber: CartNumber || `CART-${Date.now()}`, // auto-generate
      ProductName,
      ProductSKU,
      ProductImage,
      ProductPrice: Number(ProductPrice), // ensure numeric
      Quantity: Number(Quantity),
      ReferenceID: ReferenceID || null, // <-- add ReferenceID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await collection.insertOne(cartItem);

    res.status(201).json({ message: "Product added to cart", id: insertedId, data: cartItem });
  } catch (error) {
    console.error("Create cart error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
