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
    await prisma.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    return NextResponse.json("ok");
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}


/**
 * update a comment
 * @body {oldContent, content} 
 * @returns 
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json("Unauthorized", { status: 401 });

  const body = await req.json();

  try {
    await prisma.comment.update({
      where: {
        id: params.commentId,
      },
      data: {
        content: body.content,
        updateHistory: {
          create: {
            userId: session.user.id,
            approvedBy: session.user.username!,
            newContent: body.content,
            oldContent: body.oldContent,
            type: "COMMENT",
            updatedBy: session.user.id,
          },
        },
      },
    });

    return NextResponse.json("ok");
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
