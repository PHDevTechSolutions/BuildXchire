import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end(`Method ${req.method} Not Allowed`);

  try {
    const db = await connectToDatabase();
    const collection = db.collection("products");

    const {
      ProductName, ProductDescription, ProductImage, ProductStatus, ProductGallery,
      ProductCategory, ProductTag, ProductBrand, ProductPrice, ProductSku, StockStatus,
      ProductWeight, ProductLength, ProductWidth, ProductHeight, EnableReview, MenuOrder, ProductBadge, ProductBarcode, ProductSalePrice,
      ProductShortDescription, ProductStockQuantity, PurchaseNote, ShippingClass, ReferenceID, createdBy
    } = req.body;

    if (!ProductName || !ProductDescription || !ProductPrice) {
      return res.status(400).json({ error: "Missing required fields: name, description, or price." });
    }

    const product = {
      ProductName,
      ProductDescription,
      ProductImage,
      ProductStatus,
      ProductGallery,
      ProductCategory,
      ProductTag,
      ProductBrand,
      ProductPrice: parseFloat(ProductPrice),
      ProductSku,
      StockStatus,
      ProductWeight: parseFloat(ProductWeight) || 0,
      ProductLength: parseFloat(ProductLength) || 0,
      ProductWidth: parseFloat(ProductWidth) || 0,
      ProductHeight: parseFloat(ProductHeight) || 0,
      EnableReview,
      MenuOrder,
      ProductBadge,
      ProductBarcode,
      ProductSalePrice,
      ProductShortDescription,
      ProductStockQuantity,
      PurchaseNote,
      ShippingClass,
      ReferenceID: ReferenceID || "",
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { insertedId } = await collection.insertOne(product);

    res.status(201).json({ message: "Product created", id: insertedId });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
