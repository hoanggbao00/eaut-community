import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      await prisma.notification.updateMany({
        where: {
          notifierId: session.user.id,
        },
        data: {
          status: true,
        },
      });
    } else {
      await prisma.notification.update({
        where: {
          id: id,
        },
        data: {
          status: true,
        },
      });
    }

    return NextResponse.json("Ok");
  } catch (error) {
    console.log(error);

    return NextResponse.json(API_RESPONSES[STATUS_CODE.SERVER_ERROR], {
      status: 500,
    });
  }
}
