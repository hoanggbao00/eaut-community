import { getAuthSession } from "@/lib/auth";
import { STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthorized", {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    // check if User is admin
    if (session.user.role !== UserRole.ADMIN)
      return NextResponse.json("NO_PERMISSION", {
        status: STATUS_CODE.NOT_ALLOWED,
      });

    // Get body data
    const body = await req.json();

    // Update community status
    await prisma.community.update({
      where: {
        id: body.communityId
      },
      data: {
        status: body.requestStatus
      },
    });

    // Update request status
    await prisma.requestCommunity.update({
      where: {
        id: body.id
      },
      data: {
        status: body.requestStatus,
        updateById: session.user.id
      },
    });
    return NextResponse.json("OK", { status: STATUS_CODE.ACCEPTED });
  } catch (error) {
    return NextResponse.json("Could not update community", { status: 500 });
  }
}
