import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

// DELETE: /api/community/unfollow

/**
 * Unfollow a community
 * @body {communityId: communityId}
 * @returns
 */
export async function POST(req: Request) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const body = await req.json();
    const { communityId } = body;

    // check if user has already followed or not
    const followExists = await prisma.follow.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
      select: {
        id: true,
        community: {
          select: {
            id: true,
            notifierIds: true,
          },
        },
      },
    });

    if (!followExists) {
      return NextResponse.json("You've not been followed to this community.", {
        status: STATUS_CODE.BAD_REQUEST,
      });
    }

    // create community and associate it with the user
    await prisma.follow.delete({
      where: {
        id: followExists.id,
      },
    });

    // delete notifiers in community
    const newNotifiers = followExists.community.notifierIds.filter(
      (id) => id !== session.user.id,
    );

    await prisma.community.update({
      where: {
        id: followExists.community.id,
      },
      data: {
        notifierIds: newNotifiers,
      },
    });

    return NextResponse.json({
      message: "You are now no longer follow this community.",
    });
  } catch (error) {
    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: STATUS_CODE.SERVER_ERROR,
    });
  }
}
