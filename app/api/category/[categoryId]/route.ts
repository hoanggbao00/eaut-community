import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT: /api/category/[category]

export async function PUT(
  req: NextRequest,
  { params }: { params: { categoryId: string } },
) {
  try {
    const session = await getAuthSession();

    if (!session) return NextResponse.json("Unauthorized", { status: 401 });

    if (session.user.role !== "ADMIN")
      return NextResponse.json("Not permission", { status: 403 });

    const body = await req.json();

    await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        title: body.title,
      },
    });

    return NextResponse.json("Category Updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
