import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  const postId = params.postId;
  if (!postId) return NextResponse.json("Not given postId", { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const take = parseInt(searchParams.get("take") || "6");

  try {
    //find post
    const existsPost = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        community: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existsPost)
      return NextResponse.json("Not found post", { status: 404 });

    const query: Prisma.CommentFindManyArgs = {
      where: {
        postId: postId,
      },
      include: {
        author: {
          include: {
            createdCommunity: {
              where: {
                name: existsPost.community.name,
              },
              select: {
                name: true,
              },
            },
            communityModerator: {
              where: {
                community: {
                  name: existsPost.community.name,
                },
              },
              select: {
                community: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        votes: true,
        replies: {
          include: {
            author: {
              include: {
                createdCommunity: {
                  where: {
                    name: existsPost.community.name,
                  },
                  select: {
                    name: true,
                  },
                },
                communityModerator: {
                  where: {
                    community: {
                      name: existsPost.community.name,
                    },
                  },
                  select: {
                    community: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            votes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: take,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take,
      skip: (page - 1) * take, // skip should start from 0 for page 1
    };

    const [total, data] = await prisma.$transaction([
      prisma.comment.count({
        where: {
          postId: postId,
        },
      }),
      prisma.comment.findMany(query),
    ]);

    return NextResponse.json({ total: total, data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
