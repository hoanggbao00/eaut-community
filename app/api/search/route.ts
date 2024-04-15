import prisma from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const url = new URL(req.url);
	const q = url.searchParams.get('q');

	if (!q) return NextResponse.json('No query provided', { status: 400 });

	const results = await prisma.$transaction([
		prisma.community.findMany({
			where: {
				name: {
					contains: q,
					mode:'insensitive'
				},
			},
			include: {
				_count: true,
			},
			take: 5,
		}),
		prisma.post.findMany({
			where: {
				title: {
					contains: q,
				},
			},
			include: {
				_count: true,
				community: {
					select: {
						name: true
					}
				}
			},
			take: 5,
		}),
	]);

	return NextResponse.json(results);
}
