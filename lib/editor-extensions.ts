import {
	TiptapLink,
	TaskList,
	TaskItem,
	HorizontalRule,
	StarterKit,
	Placeholder,
	AIHighlight,
	TiptapImage
} from 'novel/extensions';

import TextStyle from '@tiptap/extension-text-style';


const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;

const tiptapImage = TiptapImage.configure({
	allowBase64: true,
	HTMLAttributes: {
		class: 'rounded-lg border border-muted',
	},
});

const tiptapLink = TiptapLink.configure({
	HTMLAttributes: {
		class:
			'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
	},
});

const taskList = TaskList.configure({
	HTMLAttributes: {
		class: 'not-prose pl-2 ',
	},
});
const taskItem = TaskItem.configure({
	HTMLAttributes: {
		class: 'flex gap-2 items-start my-4',
	},
	nested: true,
});

const horizontalRule = HorizontalRule.configure({
	HTMLAttributes: {
		class: 'mt-4 mb-6 border-t border-muted-foreground',
	},
});

const starterKit = StarterKit.configure({
	bulletList: {
		HTMLAttributes: {
			class: 'list-disc list-outside leading-3 -mt-2',
		},
	},
	orderedList: {
		HTMLAttributes: {
			class: 'list-decimal list-outside leading-3 -mt-2',
		},
	},
	listItem: {
		HTMLAttributes: {
			class: 'leading-normal -mb-2',
		},
	},
	blockquote: {
		HTMLAttributes: {
			class: 'border-l-4 border-primary',
		},
	},
	codeBlock: {
		HTMLAttributes: {
			class:
				'rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium',
		},
	},
	code: {
		HTMLAttributes: {
			class: 'rounded-md bg-muted  px-1.5 py-1 font-mono font-medium',
			spellcheck: 'false',
		},
	},
	horizontalRule: false,
	dropcursor: {
		color: '#DBEAFE',
		width: 4,
	},
	gapcursor: false,
});

export const defaultExtensions = [
	starterKit,
	placeholder,
	tiptapLink,
	taskList,
	taskItem,
	horizontalRule,
	aiHighlight,
	tiptapImage,
	TextStyle
];
