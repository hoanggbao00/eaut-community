import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebaseConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
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
