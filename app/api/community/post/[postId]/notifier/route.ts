import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthorized", {
        status: 401,
      });

    const body = await req.json();
    const postId = params.postId;
    const { notifierIds } = body;

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        notifierIds: notifierIds,
      },
    });

    return NextResponse.json("OK");
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
