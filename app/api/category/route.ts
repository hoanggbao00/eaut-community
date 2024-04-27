import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST: /api/category

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) return NextResponse.json("Unauthorized", { status: 401 });

    if (session.user.role !== "ADMIN")
      return NextResponse.json("Not permission", { status: 403 });

    const body = await req.json();

    await prisma.category.create({
      data: {
        title: body.title,
        icon: body.icon
      },
    });

    return NextResponse.json("Category Created", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
