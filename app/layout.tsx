import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/prosemirror.css';
import Header from '@/components/header/header';
import Providers from '@/providers/providers';
import { Toaster } from '@/components/ui/toaster';
import NextTopLoader from 'nextjs-toploader';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'EAUT Community',
	description: 'QnA Community of EAUT',
};

export default function RootLayout({
	children,
	authModal,
	submitModal,
}: Readonly<{
	children: React.ReactNode;
	authModal: React.ReactNode;
	submitModal: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={cn(
					'min-h-screen bg-background text-foreground antialiased',
					inter.className
				)}
			>
				<NextTopLoader />
				<Providers>
					<Header />
					{authModal}
					{submitModal}
					<main className='mx-auto h-full px-2 sm:px-2 pt-20 sm:container xl:pl-72'>
						{children}
					</main>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
