import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { Entity } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    // check if user has already voted on this post
    const existingVote = await prisma.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await prisma.commentVote.delete({
          where: {
            id: existingVote.id,
            commentId,
            userId: session.user.id,
          },
        });
        return NextResponse.json("OK");
      } else {
        // if vote type is different, update the vote
        await prisma.commentVote.update({
          where: {
            id: existingVote.id,
            commentId,
            userId: session.user.id,
          },
          data: {
            type: voteType,
          },
        });
        return NextResponse.json("OK");
      }
    }

    // if no existing vote, create a new vote
    const newVote = await prisma.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
      select: {
        comment: {
          select: {
            authorId: true,
            id: true,
            postId: true,
            post: {
              select: {
                community: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    //create notification to comment author
    if (session.user.id !== newVote.comment.authorId) {
      await prisma.notification.create({
        data: {
          entityId: newVote.comment.id,
          message: "voted to your comment in",
          senderId: session.user.id,
          type: Entity.COMMENT,
          notifierId: newVote.comment.authorId,
          communityName: newVote.comment.post.community.name,
        },
      });
    }

    return NextResponse.json("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.message, { status: 400 });
    }

    return NextResponse.json(
      "Could not post to community at this time. Please try later",
      { status: 500 },
    );
  }
}
