import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserService from "@/services/users";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserService.addOne(name, email, hashedPassword, role);
    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}