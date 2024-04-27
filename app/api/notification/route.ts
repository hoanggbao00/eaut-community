import { getAuthSession } from "@/lib/auth";
import { STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json("No authentication", {
      status: STATUS_CODE.UNAUTHORIZED,
    });

  // Get All notification of user id
  const notifications = await prisma.notification.findMany({
    where: {
      notifierId: session.user.id,
    },
    include: {
      sender: {
        select: {
          name: true,
          username: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      comment: {
        select: {
          id: true,
          postId: true,
          content: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20
  });

  return NextResponse.json(notifications, {
    status: STATUS_CODE.OK,
  });
}
