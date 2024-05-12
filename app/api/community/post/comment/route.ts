import { getAuthSession } from "@/lib/auth";
import { STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { CommentValidator } from "@/lib/validators/comment";
import { Entity } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//POST: /api/community/post/comment

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { postId, content, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    //find post
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
        notifierIds: true,
        community: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post)
      return NextResponse.json("Post not found", {
        status: STATUS_CODE.NOT_FOUND,
      });

    // find author of reply if given
    const replyAuthor =
      replyToId &&
      (await prisma.comment.findFirst({
        where: {
          id: replyToId,
        },
        select: {
          id: true,
          authorId: true,
        },
      }));

    // create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    //create notification to post author
    if(session.user.id !== comment.authorId )
    await prisma.notification.create({
      data: {
        entityId: comment.id,
        message: "has comment to your post in",
        senderId: session.user.id,
        type: Entity.COMMENT,
        notifierId: post.authorId,
        communityName: post.community.name,
      },
    });

    // create notification to comment author
    if (replyAuthor && session.user.id !== replyAuthor.authorId)
      await prisma.notification.create({
        data: {
          entityId: comment.id,
          message: "replied to your comment in",
          senderId: session.user.id,
          type: Entity.COMMENT,
          notifierId: replyAuthor.authorId,
          communityName: post.community.name,
        },
      });

    // create notification to notifierIds
    if (post.notifierIds.length > 0) {
      await prisma.notification.createMany({
        data: post.notifierIds.map((userId) => ({
          entityId: comment.id,
          message: "comment post your followed in",
          senderId: session.user.id,
          type: Entity.COMMENT,
          notifierId: userId,
          communityName: post.community.name,
        })),
      });
    }
    return NextResponse.json("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.message, { status: 400 });
    }

    return NextResponse.json(
      "Could not create comment at this time. Please try later",
      { status: 500 },
    );
  }
}
