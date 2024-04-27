import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, STATUS_CODE } from "@/lib/constants";
import { isAdmin } from "@/lib/db/db";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const { id: userId, role } = session.user;

    // check if User is admin
    if (!isAdmin(role)) {
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_ALLOWED], {
        status: STATUS_CODE.NOT_ALLOWED,
      });
    }

    // Get body data
    const body = await req.json();
    const { requestId } = body;

    //find request content
    const request = await prisma.request.findFirst({
      where: {
        id: requestId,
      },
    });

    if (!request)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_FOUND], {
        status: STATUS_CODE.NOT_FOUND,
      });

    const community = await prisma.community.findFirst({
      where: {
        id: request.communityId!,
      },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_FOUND], {
        status: STATUS_CODE.NOT_FOUND,
      });
    }

    // Update request status
    await prisma.request.update({
      where: {
        id: request.id,
      },
      data: {
        status: "REJECTED",
        updateBy: session.user.name,
      },
    });

    // send notification to user
    await prisma.notification.create({
      data: {
        type: "COMMUNITY",
        senderId: userId,
        notifierId: request.senderId,
        message: `reject your request to ${request.requestType.toLowerCase()}`,
        communityName: community.name,
      },
    });

    //if decline to create new community
    if (request.requestType === "CREATE")
      await prisma.community.delete({
        where: {
          id: community.id,
        },
      });

    return NextResponse.json(API_RESPONSES[STATUS_CODE.OK], {
      status: STATUS_CODE.OK,
    });

    //TODO: RequestType = DELETE
  } catch (error) {
    return NextResponse.json("Could not update community", { status: 500 });
  }
}
