import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { CommentValidator } from '@/lib/validators/comment';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(req: Request) {
	try {
		const body = await req.json();

		const { postId, text, replyToId } = CommentValidator.parse(body);

		const session = await getAuthSession();

		if (!session?.user) {
			return NextResponse.json('Unauthorized', { status: 401 });
		}

		// if no existing vote, create a new vote
		await prisma.comment.create({
			data: {
				text,
				postId,
				authorId: session.user.id,
				replyToId,
			},
		});

		return NextResponse.json('OK');
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(error.message, { status: 400 });
		}

		return NextResponse.json(
			'Could not post to community at this time. Please try later',
			{ status: 500 }
		);
	}
}
