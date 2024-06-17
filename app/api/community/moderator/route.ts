import { API_RESPONSES, NOTI_MESSAGES, NOTIFICATION_MESSAGE, STATUS_CODE } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, isCreator } from "@/lib/db/db";
import { Entity } from "@prisma/client";

//POST: /api/community/moderator

/**
 * Add ad moderator to community
 * @body {communityId: communityId, userIds: listIdsOfUser[]}
 * @returns
 */
export async function PUT(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    // Get body data
    const body = await req.json();
    const ids = body.userIds as string[];
    const communityId = body.communityId;

    // Check if community exists
    const communityExists = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
      include: {
        moderators: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!communityExists)
      return NextResponse.json("Community not found", {
        status: STATUS_CODE.NOT_FOUND,
      });

    // check if user has permission to do this action
    if (
      !isAdmin(session.user.role) &&
      !isCreator(session.user.id, communityExists.creatorId!)
    )
      return NextResponse.json("You don't have permission to do this action!", {
        status: STATUS_CODE.NOT_ALLOWED,
      });

    if (ids.length === 0) {
      await prisma.community.update({
        where: {
          id: communityId,
        },
        data: {
          moderators: {
            deleteMany: {},
          },
        },
      });

      await prisma.notification.create({
        data: {
          type: Entity.COMMUNITY,
          senderId: session.user.id,
          notifierId: communityExists.moderators[0].userId,
          entityId: communityId,
          message: NOTI_MESSAGES.REMOVE_MODERATOR,
          communityName: communityExists.name,
        },
      });
      return NextResponse.json("Moderators deleted", {
        status: STATUS_CODE.OK,
      });
    }

    // check if moderator is removed someone
    const removed = communityExists.moderators.filter(
      (mod) => !ids.find((id) => mod.userId === id),
    );
    const added = ids.filter(
      (id) => !communityExists.moderators.find((mod) => mod.userId === id),
    );

    // Remove moderator
    if (removed.length > 0) {
      await prisma.communityModerator.deleteMany({
        where: {
          communityId: communityId,
          userId: {
            in: removed.map((mod) => mod.userId),
          },
        },
      });
      await prisma.notification.createMany({
        data: removed.map((user) => ({
          type: Entity.COMMUNITY,
          senderId: session.user.id,
          notifierId: user.userId,
          entityId: communityId,
          message: NOTI_MESSAGES.REMOVE_MODERATOR,
          communityName: communityExists.name,
        })),
      });
    }

    // add moderator
    await prisma.communityModerator.createMany({
      data: added.map((id) => ({
        communityId: communityId,
        userId: id,
      })),
    });

    // send notification to user
    await prisma.notification.createMany({
      data: added.map((id) => ({
        type: Entity.COMMUNITY,
        senderId: session.user.id,
        notifierId: id,
        entityId: communityId,
        message: NOTI_MESSAGES.ADD_MODERATOR,
        communityName: communityExists.name,
      })),
    });

    return NextResponse.json({
      message: "Successfully updated moderators",
    });
  } catch (error) {
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}
