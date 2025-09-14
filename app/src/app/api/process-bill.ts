//@todo install gemini api

import { GoogleGenerativeAI, Part } from "@/google/generativeAI";
import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenrativeModel({ model: "gemini-pro-vision" }); //best model for image input

type BillItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type BillData = {
  items: BillItem[];
  total_amount?: number;
  serc_at_10_percent?: number;
  state_gst_at_2_5_percent?: number;
  central_gst_at_2_5_percent?: number;
  round_off?: number;
  net_amount?: number;
  [key: string]: any; //for any other fields like name number etc.
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BillData | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. " });
  }

  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: " Image data is required. " });
  }

  //convert base64 image data to a GoogleGenrativeAI Part
  function base64ToGenerativePart(base64: string, mimeType: string): Part {
    return {
      inlineData: {
        data: base64.split(",")[1] || base64String,
        mimeType: mimeType,
      },
    };
  }

  try {
    const parts = [
      base64ToGenerativePart(imageData, "image/jpeg"),
      {
        text: ` You are an AI assistant. Analyze the attached image of a restaurant bill and extract all line items as a JSON array.
      Each item should have: description, quantity, and unit price.
      If possible, also extract restaurant name and date.
      Example output:
      {
        "restaurant_name": "Example Cafe",
        "date": "2025-07-08",
        "items": [
          {"description": "Burger", "quantity": 2, "rate": 12.99},
          {"description": "Fries", "quantity": 1, "rate": 4.99}
        ]
      }
        `,
      },
    ];

    const result = await model.genrateContent(parts);
    const response = result.response;
    const text = response.text();

    console.log("Gemini Raw Response Text:", text); //debugging

    //attempt to parse the response text as JSON
    let parsedData: BillData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.log("Raw Gemini Text:", text);
      return res
        .status(500)
        .json({
          error:
            "Failed to parse bill datat from Gemini. Raw Response was not valid JSON.",
        });
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("error calling gemini api:", error);
    res.status(500).json({ error: " Error processing image with Gemini API." });
  }
}
