// 2 to demonstrate infinite scroll, should be higher in production
export const INFINITE_SCROLL_PAGINATION_RESULTS = 5;
const PROTOCOL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ? "http://" : "https://";
export const BASE_API_URL = PROTOCOL + process.env.NEXT_PUBLIC_VERCEL_URL;

export enum STATUS_CODE {
  // Successful
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,

  // Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  NOT_ALLOWED = 405,
  DUPLICATE = 409,

  // Server Error
  SERVER_ERROR = 500,
}

export const API_RESPONSES = {
  [STATUS_CODE.OK]: {message: "OK"},
  [STATUS_CODE.SERVER_ERROR]: {message: "Something went wrong!" },
  [STATUS_CODE.NOT_ALLOWED]: {message: "You are not have permission!"},
  [STATUS_CODE.UNAUTHORIZED]: {message: "You need sign in to do this action!"},
  [STATUS_CODE.NOT_FOUND]: {message: "Not found your request!"},
};

export const ACTION_RETURN = {
  CREATED: { message: "CREATED", status: STATUS_CODE.CREATED },
  ACCEPTED: { message: "ACCEPTED", status: STATUS_CODE.ACCEPTED },
  UNAUTHORIZED: { message: "Unauthorized", status: STATUS_CODE.UNAUTHORIZED },
  DUPLICATE: { message: "Duplicate", status: STATUS_CODE.DUPLICATE },
  NO_PERMISSION: { message: "No Permission", status: STATUS_CODE.NOT_ALLOWED },
  NOT_FOUND: { message: "Not Found", status: 404 },
  BAD_REQUEST: { message: "Bad Request", status: 400 },
  ERROR: { message: "Some thing went wrong", status: 500 },
};

export const NOTIFICATION_MESSAGE = [
  "NULL",
  // COMMUNITY
  "request to create a community",
  "request to update community",
  "accepted your request",
  "rejected your request",

  // POST
  "has created a post in",
  "has updated post",
  "has voted to your post",

  // COMMENT
  "add new comment to your post",
  "updated comment",
  "voted to your comment",
  "replied your comment",
];
