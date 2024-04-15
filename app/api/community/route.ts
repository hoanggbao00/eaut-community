import { STATUS_CODE } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserRole } from "@prisma/client";

// Create Community
export async function POST(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthorized", {
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
        ...body,
        creatorId: session.user.id,
        notificationUserIdAccess: [session.user.id],
      },
    });

    // Then follow this community
    await prisma.follow.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    // Then send request to Admin
    await prisma.requestCommunity.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
        type: "CREATE",
      },
    });

    return NextResponse.json(community.name);
  } catch (error) {
    return NextResponse.json("Could not create community", { status: 500 });
  }
}

//Update
export async function PUT(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthorized", {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    // Get body data
    const body = await req.json();

    // Check if community exist
    const isExists = await prisma.community.findFirst({
      where: { name: body.name },
    });

    if (!isExists)
      return NextResponse.json("Community doesn't exist", {
        status: STATUS_CODE.REJECTED,
      });

    // Check if user is Admin or is creator
    if (
      session.user.role !== UserRole.ADMIN ||
      session.user.id !== isExists.creatorId
    ) {
      return NextResponse.json("You're not have permission to do this action", {
        status: STATUS_CODE.NOT_ALLOWED,
      });
    }

    // Send request to Admin
    await prisma.requestCommunity.create({
      data: {
        userId: session.user.id,
        communityId: isExists.id,
        type: "UPDATE",
        newContent: { ...body, updateByUsername: session.user.username },
      },
    });

    return NextResponse.json("OK", { status: STATUS_CODE.ACCEPTED });
  } catch (error) {
    return NextResponse.json("Could not update community", { status: 500 });
  }
}

//* Temporary
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    const { userId } = z
      .object({
        userId: z.string(),
      })
      .parse({
        userId: searchParams.get("userId"),
      });

    const followedCommunities = await prisma.follow.findMany({
      where: {
        userId: userId,
      },
      include: {
        community: true,
      },
    });

    return NextResponse.json(followedCommunities);
  } catch (error) {
    return NextResponse.json("Could not get community", { status: 500 });
  }
}
