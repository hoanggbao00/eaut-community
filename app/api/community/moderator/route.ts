import { STATUS_CODE } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    const ids = body.userIds as string[];
    const communityId = body.communityId;

    // Check if community name already exists
    const communityExists = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
    });

    if (!communityExists)
      return NextResponse.json("Community not found", {
        status: STATUS_CODE.REJECTED,
      });

    // check if user is creator or admin
    if (
      communityExists.creatorId !== session.user.id &&
      session.user.role !== "ADMIN"
    )
      return NextResponse.json("No_PERMISSIONS", {
        status: STATUS_CODE.NOT_ALLOWED,
      });

    // ready for insert data
    const payload = ids.map((id) => ({ userId: id, communityId: communityId }));

    // Create moderator
    await prisma.communityModerator.createMany({
      data: [...payload],
    });

    return NextResponse.json("OK");
  } catch (error) {
    return NextResponse.json("Could not update moderators", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthorized", {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    // Get body data
    const body = await req.json();
    const communityId = body.communityId;

    // Check if community name already exists
    const communityExists = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
    });

    if (!communityExists)
      return NextResponse.json("Community not found", {
        status: STATUS_CODE.REJECTED,
      });

    // check if user is creator or admin
    if (
      communityExists.creatorId !== session.user.id &&
      session.user.role !== "ADMIN"
    )
      return NextResponse.json("No_PERMISSIONS", {
        status: STATUS_CODE.NOT_ALLOWED,
      });

    // Find ids of moderator request
    const moderators = await prisma.communityModerator.findMany({
      where: {
        communityId: communityId,
      },
      select: {
        id: true
      }
    })

    // then delete it
    await prisma.communityModerator.deleteMany({
      where: {
        id: {
          in: moderators.map((mod) => mod.id)
        }
      }
    })

    return NextResponse.json("OK");
  } catch (error) {
    return NextResponse.json("Could not update moderators", { status: 500 });
  }
}
