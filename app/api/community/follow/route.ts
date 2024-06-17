import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, NOTI_MESSAGES, STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { Entity } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// POST: /api/community/follow

/**
 * Follow a community
 * @body {communityId: communityId}
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

    // Get body data
    const body = await req.json();
    const { communityId } = body;

    // Check if user already followed this community
    const followExists = await prisma.follow.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (followExists)
      return NextResponse.json("You already followed this community!", {
        status: STATUS_CODE.BAD_REQUEST,
      });

    // Create new follower
    const follow = await prisma.follow.create({
      data: {
        communityId,
        userId: session.user.id,
      },
      include: {
        community: {
          select: {
            creatorId: true,
            name: true,
            notifierIds: true,
          },
        },
      },
    });

    // Add user to get notification of community
    await prisma.community.update({
      where: {
        id: communityId,
      },
      data: {
        notifierIds: [...follow.community.notifierIds, session.user.id],
      },
    });

    //create notification to post author
    await prisma.notification.create({
      data: {
        entityId: communityId,
        message: NOTI_MESSAGES.HAS_FOLLOWED,
        senderId: session.user.id,
        type: Entity.COMMUNITY,
        notifierId: follow.community.creatorId,
        communityName: follow.community.name,
      },
    });

    return NextResponse.json({
      message: "You're now following this community",
    });
  } catch (error) {
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}
