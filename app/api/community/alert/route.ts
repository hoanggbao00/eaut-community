import { getAuthSession } from "@/lib/auth";
import { isAdmin, isCreator, isModerator } from "@/lib/db/db";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

//PUT, DELETE: /api/community/alert

/**
 * Update Alert data
 * @body {communityId, alerts: string[]}
 * @returns
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) return NextResponse.json("Unauthorized", { status: 401 });
    const { id, role } = session.user;

    const body = await req.json();
    const { communityId, alerts } = body;

    const isExists = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
      select: {
        communityAlert: true,
        creatorId: true,
        moderators: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!isExists)
      return NextResponse.json("Community does not exist", { status: 404 });

    // check permissions
    if (
      !isCreator(id, isExists.creatorId) &&
      !isAdmin(role) &&
      !isModerator(id, isExists.moderators)
    )
      return NextResponse.json("You do not have permission to do this action", {
        status: 403,
      });

    //update
    await prisma.community.update({
      where: {
        id: communityId,
      },
      data: {
        communityAlert: [...isExists.communityAlert, ...alerts],
      },
    });

    return NextResponse.json("Alert updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}

/**
 * Update Alert data
 * @body {communityId, content: string}
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) return NextResponse.json("Unauthorized", { status: 401 });
    const { id, role } = session.user;

    const body = await req.json();
    const { communityId, content } = body;

    const isExists = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
      select: {
        communityAlert: true,
        creatorId: true,
        moderators: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!isExists)
      return NextResponse.json("Community does not exist", { status: 404 });

    // check permissions
    if (
      !isCreator(id, isExists.creatorId) &&
      !isAdmin(role) &&
      !isModerator(id, isExists.moderators)
    )
      return NextResponse.json("You do not have permission to do this action", {
        status: 403,
      });

    //update
    const payload = isExists.communityAlert.filter((c) => c !== content);

    await prisma.community.update({
      where: {
        id: communityId,
      },
      data: {
        communityAlert: payload,
      },
    });

    return NextResponse.json("Alert updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
