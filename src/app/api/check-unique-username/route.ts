import dbConnect from "@/libs/dbConect";
import UserModel from "@/src/models/User.models";
import { json } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({
        success: false,
        message: 'Username is required',
    }), { 
        status: 400 ,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await dbConnect();
    const user = await UserModel.findOne({ username });

    if (user) {
      return new Response(JSON.stringify({
        success: false,
        message: "Username is already taken"
    }), { 
        status: 409, 
        headers: { 'Content-Type': 'application/json' 

        } });
    } else {
      return new Response(JSON.stringify({
        success: true,
        message: "Username is available"
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' 
        } });
    }
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({
        success: false,
        message: 'Internal server error',
    }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}