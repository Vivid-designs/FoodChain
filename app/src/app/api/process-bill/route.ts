// app/src/app/api/process-bill/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this bill/receipt image and extract all food items with their prices. 
    Return the data as a JSON object with this exact structure:
    {
      "items": [
        {
          "name": "item name",
          "price": number,
          "quantity": number
        }
      ],
      "total": number,
      "tax": number,
      "subtotal": number
    }
    
    Only return valid JSON, no other text.`;

    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log('Cleaned response:', cleanText);

    // Parse the JSON response
    const billData = JSON.parse(cleanText);

    return NextResponse.json(billData);
  } catch (error) {
    console.error('Error processing bill:', error);
    return NextResponse.json(
      { error: 'Failed to process bill' }, 
      { status: 500 }
    );
  }
}