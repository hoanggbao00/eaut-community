// 2 to demonstrate infinite scroll, should be higher in production
export const INFINITE_SCROLL_PAGINATION_RESULTS = 5;
const PROTOCOL =
	process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ? 'http://' : 'https://';
export const BASE_API_URL = PROTOCOL + process.env.NEXT_PUBLIC_VERCEL_URL;

export enum STATUS_CODE {
	OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	REJECTED = 203,
	UNAUTHORIZED = 401,
	NOT_ALLOWED = 405,
	DUPLICATE = 409,
}

export const ACTION_RETURN = {
	CREATED: {message: 'CREATED', status: STATUS_CODE.CREATED},
	ACCEPTED: {message: 'ACCEPTED', status: STATUS_CODE.ACCEPTED},
	UNAUTHORIZED: { message: 'Unauthorized', status: STATUS_CODE.UNAUTHORIZED },
	DUPLICATE: { message: 'Duplicate', status: STATUS_CODE.DUPLICATE },
	NO_PERMISSION: { message: 'No Permission', status: STATUS_CODE.NOT_ALLOWED },
	REJECTED: { message: 'Rejected', status: STATUS_CODE.REJECTED },
	NOT_FOUND: { message: 'Not Found', status: 404 },
	BAD_REQUEST: { message: 'Bad Request', status: 400 },
	ERROR: { message: 'Some thing went wrong', status: 500 },
};

export enum NOTIFICATION_TYPE {
	// COMMUNITY
	COMMUNITY_REQUEST_SENT = 1,
	COMMUNITY_RESPONSE_ACCEPTED,
	COMMUNITY_RESPONSE_REJECTED,
	COMMUNITY_NEW_FOLLOWER,
	COMMUNITY_CREATE_POST,

	// POST
	POST_UPDATE,
	POST_UPVOTE,
	POST_DOWNVOTE,
	POST_CREATE_COMMENT,

	// COMMENT
	COMMENT_UPDATE,
	COMMENT_UPVOTE,
	COMMENT_DOWNVOTE,
	COMMENT_CREATE_REPLY,
}
