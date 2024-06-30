// 2 to demonstrate infinite scroll, should be higher in production
export const INFINITE_SCROLL_PAGINATION_RESULTS = 6;
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

export const NOTI_MESSAGES = {
  REQUEST_CREATE: "yêu cầu tạo cộng đồng",
  REQUEST_UPDATE: "yêu cầu cập nhật cộng đồng",
  ACCEPTED: "đã chấp nhận yêu cầu",
  REJECTED: "đã từ chối yêu cầu",
  HAS_FOLLOWED: "đã tham gia",
  ADD_MODERATOR: "thêm bạn làm kiểm duyệt của ",
  REMOVE_MODERATOR: "thu hồi quyền kiểm duyệt của bạn trong",
  REMOVE_POST: "xóa bài viết",
  YOUR_IN: "của bạn trong",
  POST_FOLLOW_UPDATED: "bài viết bạn theo dỗi vừa được cập nhật",
  COMMENT_POST: "bình luận vào bài viết của bạn trong",
  COMMENT_POST_OTHER: "bình luận vào bài viết bạn đang theo dõi trong",
  REPLY_COMMENT: "đã phản hồi bình luận của bạn trong",
  COMMENT_VOTE: "đã vote bình luận của bạn trong",
  POST_ADD: "thêm bài viết trong",
  POST_VOTE: "vote bài viết của bạn trong"
}
