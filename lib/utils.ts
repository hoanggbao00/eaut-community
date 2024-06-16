import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebaseConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "mới đây",
  xSeconds: "mới đây",
  halfAMinute: "mới đây",
  lessThanXMinutes: "{{count}} phút",
  xMinutes: "{{count}} phút",
  aboutXHours: "{{count}} giờ",
  xHours: "{{count}} giờ",
  xDays: "{{count}} ngày",
  aboutXWeeks: "{{count}} tuần",
  xWeeks: "{{count}} tuần",
  aboutXMonths: "{{count}} tháng",
  xMonths: "{{count}} tháng",
  aboutXYears: "{{count}} năm",
  xYears: "{{count}} năm",
  overXYears: "{{count}} năm",
  almostXYears: "{{count}} năm",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "trong " + result;
    } else {
      if (result === "mới đây") return result;
      return result + " trước";
    }
  }

  return result;
}

export function formatDate(date: string, showTime?: boolean) {
  const value = date.split("T");
  const time = value[1].slice(0, 5);
  return `${value[0]} ${showTime ? time : ""}`;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: { formatDistance },
  });
}

/**
 * Compress image to smaller size
 * @description Reference https://pqina.nl/blog/compress-image-before-upload/#saving-the-compressed-image-back-to-the-file-input
 * @param file Image to compress
 * @param param1 {}
 * @returns File
 */
export const compressImage = async (
  file: File,
  { quality = 1, type = file.type },
) => {
  // Get as image data
  const imageBitmap = await createImageBitmap(file);

  // Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d");
  ctx!.drawImage(imageBitmap, 0, 0);

  // Turn into Blob
  const blob = await new Promise<any>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  );
  // Turn Blob into File
  return new File([blob], file.name, {
    type: blob.type,
  });
};

export const uploadImage = async (item: File) => {
  const { name } = item;
  const imageRef = ref(storage, name);

  try {
    const snapshot = await uploadBytes(imageRef, item);
    const imageUrl = await getDownloadURL(snapshot.ref);
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
};

export const checkYoutubeUrl = (url: string) => {
  const regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
  const isValid = regex.test(url);

  return isValid;
};

export const getYoutubeId = (url: string) => {
  const [a, , b] = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (b !== undefined) {
    return b.split(/[^0-9a-z_-]/i)[0];
  } else {
    return a;
  }
};

export function urlify(text: string) {
  const URL_REGEX = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
  return text.replace(URL_REGEX, function(url) {
    return `<a style='text-decoration: underline; color: CornflowerBlue;' href="${url}">${url}</a>`;
  })
}