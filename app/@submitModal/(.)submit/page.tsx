import CloseAuthModal from '@/components/auth-modal/close-auth-modal';
import { SubmitForm } from '@/components/editor/submit-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

const page = async () => {
	const session = await getAuthSession();

	if (!session) {
		return redirect('/sign-in');
	}

	const followedCommunities = await prisma.follow.findMany({
		where: {
			...(session && { userId: session.user.id }),
		},
		include: {
			community: true,
		},
	});

	if (!followedCommunities)
		return toast({
			title: 'You not join any community',
			description: 'You not join any community',
			variant: 'destructive',
		});

	return (
		<div className='fixed inset-0 z-[52] bg-black/20 xl:pl-72 pt-14'>
			<div className='flex h-full w-full items-center justify-center'>
				<Card className='sm:w-[80dvw] bg-background xl:w-[65dvw]'>
					<CardHeader className='!flex-row items-center justify-between pb-3'>
						<CardTitle className='text-2xl'>Create Post</CardTitle>
						<CloseAuthModal forSubmit={true} />
					</CardHeader>
          <Separator className='mb-2'/>
					<CardContent className='max-h-[78dvh] overflow-auto'>
						<SubmitForm communities={followedCommunities} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default page;
