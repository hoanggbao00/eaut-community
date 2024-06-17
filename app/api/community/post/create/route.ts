import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, NOTI_MESSAGES, STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { Entity, VoteType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

//POST: /api/community/post/create

/**
 * Add a post
 * @body {communityId: communityId, title: Title of community, content: JsonValue }
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const body = await req.json();
    const { communityId, title, content, attachment } = body;

    //check if user has followed
    const followExists = await prisma.follow.findFirst({
      where: {
        AND: [{ userId: session.user.id }, { communityId: communityId }],
      },
      select: {
        community: {
          select: {
            notifierIds: true,
          },
        },
      },
    });

    if (!followExists)
      return NextResponse.json("Follow to create a post", {
        status: STATUS_CODE.BAD_REQUEST,
      });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        communityId,
        authorId: session.user.id,
        votes: {
          create: {
            userId: session.user.id,
            type: VoteType.UP
          }
        },
        ...(attachment && { attachment: attachment }),
      },
      select: {
        id: true,
        community: {
          select: {
            name: true,
          },
        },
      },
    });

    // send notification to users whose accept notification
    const notifierIds = followExists.community.notifierIds.filter(
      (e) => e !== session.user.id,
    );

    if (notifierIds.length > 0) {
      await prisma.notification.createMany({
        data: notifierIds.map((id) => ({
          entityId: post.id,
          message: NOTI_MESSAGES.POST_ADD,
          senderId: session.user.id,
          type: Entity.POST,
          notifierId: id,
          communityName: post.community.name,
        })),
      });
    }

    return NextResponse.json("Successful");
  } catch (error) {
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}
