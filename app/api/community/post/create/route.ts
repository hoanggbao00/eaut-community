import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { PostValidator } from '@/lib/validators/post';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
	try {
		const session = await getAuthSession();

		if (!session?.user)
			return NextResponse.json('Unauthorized', { status: 401 });

		const body = await req.json();

		const { communityId, title, content } = PostValidator.parse(body);

		const followExists = await prisma.follow.findFirst({
			where: {
				communityId,
				userId: session.user.id,
			},
		});

		if (!followExists)
			return NextResponse.json('Follow this community to post', {
				status: 400,
			});

		await prisma.post.create({
			data: {
        title,
        content,
				communityId,
				authorId: session.user.id,
			},
		});

		return NextResponse.json('OK');
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json('Invalid request data passed', { status: 422 });
		}
		return NextResponse.json('Could not post to community at this time, please try again later', {
			status: 500,
		});
	}
}
