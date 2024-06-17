import { getAuthSession } from "@/lib/auth";
import { API_RESPONSES, NOTI_MESSAGES, STATUS_CODE } from "@/lib/constants";
import { isAdmin, isCreator, isModerator } from "@/lib/db/db";
import prisma from "@/lib/db/prisma";
import { Entity, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

//DELETE, PUT: /api/community/post/[postId]

/**
 * delete post
 * @returns
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const { id: userId, role } = session.user;

    // check if exists post
    const existsPost = await prisma.post.findFirst({
      where: {
        id: params.postId,
      },
      select: {
        communityId: true,
        title: true,
        authorId: true,
        notifierIds: true,
        community: {
          select: {
            creatorId: true,
            name: true,
            moderators: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!existsPost)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_FOUND], {
        status: STATUS_CODE.NOT_FOUND,
      });

    // check user has permission
    if (
      !isAdmin(role) &&
      !isCreator(userId, existsPost.authorId) &&
      !isCreator(userId, existsPost.community.creatorId!) &&
      !isModerator(userId, existsPost.community.moderators)
    ) {
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_ALLOWED], {
        status: STATUS_CODE.NOT_ALLOWED,
      });
    }

    await prisma.post.delete({
      where: {
        id: params.postId,
      },
    });

    // if not author delete so send notification to author
    if (!isCreator(userId, existsPost.authorId)) {
      await prisma.notification.create({
        data: {
          type: Entity.COMMUNITY,
          senderId: userId,
          notifierId: existsPost.authorId,
          entityId: existsPost.communityId,
          message: `${NOTI_MESSAGES.REMOVE_POST} ${existsPost.title} ${NOTI_MESSAGES.YOUR_IN}`,
          communityName: existsPost.community.name,
        },
      });
    }

    return NextResponse.json("Post Deleted", { status: STATUS_CODE.OK });
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}

// Update post
export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.UNAUTHORIZED], {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const { id: userId, role } = session.user;

    const body = await req.json();

    // check if exists post
    const existsPost = await prisma.post.findFirst({
      where: {
        id: params.postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        notifierIds: true,
        community: {
          select: {
            name: true,
            creatorId: true,
            moderators: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
    });

    if (!existsPost)
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_FOUND], {
        status: STATUS_CODE.NOT_FOUND,
      });

    // check if is author, is moderator, is admin
    if (
      !isAdmin(role) &&
      !isCreator(userId, existsPost.authorId) &&
      !isCreator(userId, existsPost.community.creatorId!) &&
      !isModerator(userId, existsPost.community.moderators)
    ) {
      return NextResponse.json(API_RESPONSES[STATUS_CODE.NOT_ALLOWED], {
        status: STATUS_CODE.NOT_ALLOWED,
      });
    }

    const oldContent = {
      ...(existsPost.title && { title: existsPost.title }),
      ...(existsPost.content && { content: existsPost.content }),
    };

    await prisma.post.update({
      where: {
        id: params.postId,
      },
      data: {
        ...body,
        updateHistory: {
          create: {
            approvedBy: session.user.username!,
            updatedBy: session.user.username!,
            oldContent: oldContent,
            newContent: { ...body },
            type: Entity.POST,
          },
        },
      },
    });

    // send notification to author if other edit it
    if (!isCreator(userId, existsPost.authorId)) {
      await prisma.notification.create({
        data: {
          type: Entity.POST,
          senderId: userId,
          entityId: existsPost.id,
          message: NOTI_MESSAGES.POST_FOLLOW_UPDATED,
          notifierId: existsPost.authorId,
          communityName: existsPost.community.name,
        },
      });
    }

    // send notification to user follow this post
    if (existsPost.notifierIds.length > 0) {
      await prisma.notification.createMany({
        data: existsPost.notifierIds.map((id) => ({
          type: Entity.POST,
          senderId: userId,
          entityId: existsPost.id,
          message: NOTI_MESSAGES.POST_FOLLOW_UPDATED,
          notifierId: id,
          communityName: existsPost.community.name,
        })),
      });
    }

    return NextResponse.json("Post Updated", { status: STATUS_CODE.OK });
  } catch (error) {
    console.log(error);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
