import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req, res) {
  const { name, email, password } = await req.json();

  // Define password validation criteria
  const minLength = password.length >= 16;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const specialChar = /[^A-Za-z0-9]/.test(password);

  // Check if all criteria are met
  if (!minLength || !uppercase || !lowercase || !number || !specialChar) {
    return res
      .status(400)
      .json({ error: "Password does not meet the criteria." });
  }
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "User already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(user);
  }
}
