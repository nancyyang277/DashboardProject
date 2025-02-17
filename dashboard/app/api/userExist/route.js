import { NextResponse } from "next/server";
import UserService from "@/services/users";

export async function POST(req) {
    try {
      const { email } = await req.json();
      const user = await UserService.checkOneExist(email);
      return NextResponse.json({ user });
    } catch (error) {
      console.log(error);
    }
  }