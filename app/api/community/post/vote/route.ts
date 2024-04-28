import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { PostVoteValidator } from "@/lib/validators/vote";
import { Entity } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//TODO: PUT: /api/community/post/vote

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });
    }

    // check if user has already voted on this post
    const existingVote = await prisma.postVote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
        community: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json("Post not found", { status: 404 });
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await prisma.postVote.delete({
          where: {
            id: existingVote.id,
            postId,
            userId: session.user.id,
          },
        });

        return NextResponse.json("OK");
      }

      // if vote type is different, update the vote
      await prisma.postVote.update({
        where: {
          id: existingVote.id,
          postId,
          userId: session.user.id,
        },
        data: {
          type: voteType,
        },
      });
      return NextResponse.json("OK");
    }

    // if no existing vote, create a new vote
    await prisma.postVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    //create notification to post author
    if (session.user.id !== post.authorId) {
      await prisma.notification.create({
        data: {
          entityId: postId,
          message: "voted your post in",
          senderId: session.user.id,
          type: Entity.POST,
          notifierId: post.authorId,
          communityName: post.community.name,
        },
      });
    }

    return NextResponse.json("Ok");
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.message, { status: 400 });
    }

    return NextResponse.json(
      "Could not vote to this post at this time. Please try later",
      { status: 500 },
    );
  }
}
