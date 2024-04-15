'use client';
import { Button } from '@/components/ui/button';
import { FollowToCommunityPayload } from '@/lib/validators/community';
import axios from 'axios';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

interface FollowToLeaveProps {
	isFollowed: boolean;
	communityId: string;
	communityName: string;
	session: Session | null;
}

const FollowToLeave = ({
	isFollowed,
	communityId,
	communityName,
	session
}: FollowToLeaveProps) => {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [followed, setFollowed] = useState(isFollowed);
	const router = useRouter()

	const handleFollow = async () => {

		if(!session) return toast({
			title: "You need to be signed in to follow a community",
			variant: 'destructive'
		})
		setIsLoading(true);
		try {
			const query = '/api/community/' + (followed ? 'unfollow' : 'follow');
			const payload: FollowToCommunityPayload = {
				communityId,
			};

			const { data } = await axios.post(query, payload);
			if (data) {
				setFollowed(!followed);
				toast({
					title: followed ? 'Unfollowed!' : 'Followed!',
					description: `You are now ${
						followed ? 'unfollowed' : 'followed'
					} ${communityName}`,
				});
			}
		} catch (error) {
			return toast({
				title: 'There was a problem.',
				description: 'Something went wrong. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
			router.refresh()
		}
	};

	return (
		<Button
			className='rounded-full'
			onClick={() => handleFollow()}
			disabled={isLoading}
		>
			{isLoading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}{' '}
			{followed ? 'Leave' : 'Follow'}
		</Button>
	);
};

export default FollowToLeave;
