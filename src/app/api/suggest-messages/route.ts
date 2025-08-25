import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // ensure this is set in .env.local
});

export const runtime = 'edge'; // ✅ runs on the edge

export async function POST() {

    const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

  try {
    const completion = await client.completions.create({
      model: 'gpt-3.5-turbo-instruct', // instruct model (works like old GPT-3 davinci)
      prompt,
      max_tokens: 400,
    });

    return NextResponse.json({ text: completion.choices[0].text });
  } catch (error: any) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      return NextResponse.json(
        { error: 'Unexpected error', details: error.message ?? error },
        { status: 500 }
      );
    }
  }
}
