import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json("Unauthorized", { status: 422 });

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    if (!deletedComment)
      return NextResponse.json("Something went wrong", { status: 400 });
    return NextResponse.json("ok");
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json("Unauthorized", { status: 422 });

  const body = await req.json();

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: params.commentId,
      },
      data: {
        ...body,
        //TODO: set modifiedBy and modifiedDate
      },
    });

    if (!updatedComment)
      return NextResponse.json("Something went wrong", { status: 400 });
    return NextResponse.json("ok");
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
