import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function fetchHeadFooter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const type = req.query.type as string | undefined;

    const result = await db
      .collection("headfooter")
      .find(type ? { Type: type } : {})
      .toArray();

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching headfooter:", error);
    res.status(500).json({ error: "Failed to fetch headfooter" });
  }
}
