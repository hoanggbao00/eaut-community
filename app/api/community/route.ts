import { API_RESPONSES, NOTI_MESSAGES, STATUS_CODE } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, isCreator, isModerator } from "@/lib/db/db";

// POST, PUT: /api/community

/**
 * Request to create a new community
 * @body {name:communityName}
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

    // Check if community name already exists
    const communityExists = await prisma.community.findFirst({
      where: {
        name: body.name,
      },
    });

    if (communityExists)
      return NextResponse.json("Community already exists", {
        status: STATUS_CODE.DUPLICATE,
      });

    // Create community
    const community = await prisma.community.create({
      data: {
        notifierIds: [session.user.id],
        creatorId: session.user.id,
        name: body.name,
        ...body,
        followers: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });

    // Then send request to Admin
    await prisma.request.create({
      data: {
        requestType: "CREATE",
        requestFor: "COMMUNITY",
        communityId: community.id,
        communityName: body.name,
        senderId: session.user.id,
        sendTo: "ADMIN",
        detail: NOTI_MESSAGES.REQUEST_CREATE,
        status: "PENDING",
      },
    });

    const adminIds = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    if (adminIds.length > 0) {
      await prisma.notification.createMany({
        data: adminIds.map((user) => ({
          entityId: community.id,
          message: NOTI_MESSAGES.REQUEST_CREATE,
          senderId: session.user.id,
          type: "REQUEST",
          notifierId: user.id,
          communityName: community.name,
        })),
      });
    }

    return NextResponse.json(API_RESPONSES[STATUS_CODE.OK], {
      status: STATUS_CODE.OK,
    });
  } catch (error) {
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}

/**
 * Update community
 * @body {name: communityName, ...other community data}
 * @returns
 */
export async function PUT(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthenticated", {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const { id: userId, role } = session.user;

    // Get body data
    const body = await req.json();

    // Check if community exist
    const isExists = await prisma.community.findFirst({
      where: { name: body.name },
      select: {
        name: true,
        id: true,
        creatorId: true,
        moderators: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!isExists)
      return NextResponse.json("Community doesn't exist", {
        status: STATUS_CODE.NOT_FOUND,
      });
    // Check permission

    if (
      !isAdmin(role) &&
      !isCreator(userId, isExists.creatorId!) &&
      !isModerator(userId, isExists.moderators)
    ) {
      return NextResponse.json("You're not have permission!", {
        status: STATUS_CODE.NOT_ALLOWED,
      });
    }

    // Send request to Admin
    await prisma.request.create({
      data: {
        senderId: userId,
        sendTo: "ADMIN",
        requestType: "UPDATE",
        requestFor: "COMMUNITY", //
        communityId: isExists.id,
        communityName: isExists.name,
        detail: NOTI_MESSAGES.REQUEST_UPDATE,
        newContent: { ...body },
        status: "PENDING",
      },
    });

    const adminIds = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    if (adminIds.length > 0) {
      await prisma.notification.createMany({
        data: adminIds.map((user) => ({
          entityId: isExists.id,
          message: NOTI_MESSAGES.REQUEST_UPDATE,
          senderId: session.user.id,
          type: "REQUEST",
          notifierId: user.id,
          communityName: isExists.name,
        })),
      });
    }

    return NextResponse.json("Request sent to Admin!", {
      status: STATUS_CODE.OK,
    });
  } catch (error) {
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get("communityId");
    if (!communityId)
      return NextResponse.json("Not Found", { status: STATUS_CODE.NOT_FOUND });

    const community = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.log(error);
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}
