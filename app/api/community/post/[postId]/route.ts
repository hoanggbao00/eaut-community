import { getAuthSession } from "@/lib/auth";
import { STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json("Unauthorized", {
      status: STATUS_CODE.UNAUTHORIZED,
    });

  try {
    const existsPost = await prisma.post.findFirst({
      where: {
        id: params.postId,
      },
      select: {
        authorId: true,
        community: {
          select: {
            moderators: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
    });

    //check if post exists
    if (!existsPost)
      return NextResponse.json("NOT_FOUND", { status: STATUS_CODE.REJECTED });

    const permission =
      Boolean(existsPost.community.moderators.length > 0) ||
      session.user.role === UserRole.ADMIN ||
      existsPost.authorId === session.user.id;

    // check if is author, is moderator, is admin
    if (!permission)
      return NextResponse.json("You are not the author of this post", {
        status: STATUS_CODE.NOT_ALLOWED,
      });

    await prisma.post.delete({
      where: {
        id: params.postId,
      },
    });

    return NextResponse.json("Deleted", { status: STATUS_CODE.ACCEPTED });
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}

//TODO: do this
export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json("Unauthorized", {
      status: STATUS_CODE.UNAUTHORIZED,
    });

  const body = await req.json();

  const existsPost = await prisma.post.findFirst({
    where: {
      id: params.postId,
    },
    select: {
      authorId: true,
      community: {
        select: {
          moderators: {
            where: {
              userId: session.user.id,
            },
          },
        },
      },
    },
  });

  //check if post exists
  if (!existsPost)
    return NextResponse.json("NOT_FOUND", { status: STATUS_CODE.REJECTED });

  const permission =
    Boolean(existsPost.community.moderators.length > 0) ||
    session.user.role === UserRole.ADMIN ||
    existsPost.authorId === session.user.id;

  // check if is author, is moderator, is admin
  if (!permission)
    return NextResponse.json("You are not have permission to this post", {
      status: STATUS_CODE.NOT_ALLOWED,
    });

  try {
    await prisma.post.update({
      where: {
        id: params.postId,
      },
      data: {
        ...body,
        updatedByUsername: session.user.username
      },
    });

    return NextResponse.json("Updated", { status: STATUS_CODE.ACCEPTED });
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
