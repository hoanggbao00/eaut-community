import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, NOTI_MESSAGES, STATUS_CODE } from "@/lib/constants";
import { isAdmin } from "@/lib/db/db";
import prisma from "@/lib/db/prisma";
import { ActionType } from "@prisma/client";
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
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!request)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_FOUND], {
        status: STATUS_CODE.NOT_FOUND,
      });

    const community = await prisma.community.findFirst({
      where: {
        ...(request.communityId && { id: request.communityId }),
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

    // if type is create community
    if (request.requestType === ActionType.CREATE) {
      await prisma.community.update({
        where: {
          id: community.id,
        },
        data: {
          isAccessible: true,
        },
      });

      // Update request status
      await prisma.request.update({
        where: {
          id: request.id,
        },
        data: {
          status: "ACCEPTED",
          updateBy: session.user.name,
        },
      });

      // send notification to user
      await prisma.notification.create({
        data: {
          type: "COMMUNITY",
          senderId: userId,
          notifierId: request.senderId,
          entityId: community.id,
          message: `${NOTI_MESSAGES.ACCEPTED} tạo`,
          communityName: community.name,
        },
      });

      return NextResponse.json(API_RESPONSES[STATUS_CODE.OK], {
        status: STATUS_CODE.OK,
      });
    }

    // approved request for update type
    if (request.requestType === ActionType.UPDATE) {
      const oldContent = {
        description: community.description,
        categoryId: community.categoryId,
        categoryName: community.category?.title,
        rules: community.rules,
      };

      const { newContent } = request;

      await prisma.community.update({
        where: {
          id: community.id,
        },
        data: {
          updateHistory: {
            create: {
              approvedBy: session.user.username!,
              oldContent: oldContent,
              newContent: request.newContent!,
              type: "COMMUNITY",
              updatedBy: request.user.username!,
            },
          },
          ...(newContent as Object),
        },
      });

      // Update request status
      await prisma.request.update({
        where: {
          id: request.id,
        },
        data: {
          status: "ACCEPTED",
          updateBy: session.user.name,
        },
      });

      // send notification to user
      await prisma.notification.create({
        data: {
          type: "COMMUNITY",
          senderId: userId,
          notifierId: request.senderId,
          entityId: community!.id,
          message: NOTI_MESSAGES.ACCEPTED,
          communityName: community.name,
        },
      });
      return NextResponse.json(API_RESPONSES[STATUS_CODE.OK], {
        status: STATUS_CODE.OK,
      });
    }

    //TODO: RequestType = DELETE
  } catch (error) {
    return NextResponse.json("Could not update community", { status: 500 });
  }
}
