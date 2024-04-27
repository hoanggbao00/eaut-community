import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getAuthSession();

    if (!session) return NextResponse.json("Unauthorized", { status: 401 });

    if (session.user.role !== "ADMIN")
      return NextResponse.json("No permission", { status: 404 });

    await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        isDeleted: true,
        name: 'User Removed',
      },
    });

    return NextResponse.json("Ok");
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
