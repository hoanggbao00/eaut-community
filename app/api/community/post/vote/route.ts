import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { PostVoteValidator } from '@/lib/validators/vote';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();

		const { postId, voteType } = PostVoteValidator.parse(body);

		const session = await getAuthSession();

		if (!session?.user) {
			return NextResponse.json('Unauthorized', { status: 401 });
		}

		// check if user has already voted on this post
		const existingVote = await prisma.vote.findFirst({
			where: {
				userId: session.user.id,
				postId,
			},
		});

		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				author: true,
				votes: true,
			},
		});

		if (!post) {
			return NextResponse.json('Post not found', { status: 404 });
		}

		if (existingVote) {
			// if vote type is the same as existing vote, delete the vote
			if (existingVote.type === voteType) {
				await prisma.vote.delete({
					where: {
						id: existingVote.id,
						postId,
						userId: session.user.id,
					},
				});

				return NextResponse.json('OK');
			}

			// if vote type is different, update the vote
			await prisma.vote.update({
				where: {
					id: existingVote.id,
					postId,
					userId: session.user.id,
				},
				data: {
					type: voteType,
				},
			});
			return NextResponse.json('OK');
		}

		// if no existing vote, create a new vote
		await prisma.vote.create({
			data: {
				type: voteType,
				userId: session.user.id,
				postId,
			},
		});

		return NextResponse.json('OK');
	} catch (error) {
		error;
		if (error instanceof z.ZodError) {
			return NextResponse.json(error.message, { status: 400 });
		}

		return NextResponse.json(
			'Could not post to community at this time. Please try later',
			{ status: 500 }
		);
	}
}
