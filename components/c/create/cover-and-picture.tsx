import { compressImage } from "@/lib/utils";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  cover: {
    file: File | undefined;
    setCover: Dispatch<SetStateAction<File | undefined>>;
  };
  image: {
    file: File | undefined;
    setImage: Dispatch<SetStateAction<File | undefined>>;
  };
  initImage:
    | {
        cover: string | null;
        picture: string | null;
      }
    | undefined;
}

const CoverAndPicture: React.FC<Props> = ({ cover, image, initImage }) => {
  return (
    <div className="relative h-40 w-full rounded-md">
      {/* input sr-only */}
      <input
        id="cover"
        name="cover"
        className="sr-only"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={async (e) => {
          const file = e.target.files![0];
          const compressedFile: File = await compressImage(file, {
            quality: 0.8,
            type: "image/webp",
          });

          cover.setCover(compressedFile);
        }}
      />
      <input
        id="picture"
        name="picture"
        className="sr-only"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={async (e) => {
          const file = e.target.files![0];
          const compressedFile: File = await compressImage(file, {
            quality: 0.75,
            type: "image/webp",
          });
          image.setImage(compressedFile);
        }}
      />

      {/* cover */}
      <div className="relative h-4/5 rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted-foreground/20">
        {(cover.file || initImage?.cover) && (
          <Image
            alt="cover"
            fill
            src={
              (cover.file ? getImagePreview(cover.file) : initImage?.cover) ||
              ""
            }
            className="rounded-lg object-cover"
          />
        )}
        <div className="absolute inset-0 z-10 rounded-md">
          <label
            htmlFor="cover"
            className="flex h-full cursor-pointer flex-col items-center justify-center font-light"
          >
            <ImagePlus size="26" />
            Tải ảnh bìa lên
          </label>

          {cover.file && (
            <X
              className="absolute -right-2 -top-2 h-6 w-6 cursor-pointer rounded-full bg-background text-foreground shadow-md hover:bg-background/80"
              onClick={() => cover.setCover(undefined)}
            />
          )}
        </div>
      </div>

      {/* picture */}
      <div className="absolute left-5 top-1/2 z-[12] h-20 w-20 rounded-full bg-muted text-muted-foreground shadow-md transition-colors hover:bg-muted-foreground/20">
        {(image.file || initImage?.picture) && (
          <Image
            alt="picture"
            fill
            src={
              (image.file ? getImagePreview(image.file) : initImage?.picture) ||
              ""
            }
            className="rounded-full object-cover"
          />
        )}
        <div className="absolute inset-0 z-[13]">
          <label
            htmlFor="picture"
            className="flex h-full cursor-pointer items-center justify-center rounded-full "
          >
            <ImagePlus size="26" />
          </label>
          {image.file && (
            <X
              className="absolute -top-1 right-0 h-5 w-5 cursor-pointer rounded-full bg-background text-foreground shadow-md hover:bg-background/80"
              onClick={() => image.setImage(undefined)}
            />
          )}
        </div>
      </div>
      {/* end */}
    </div>
  );
};

function getImagePreview(file: File | undefined) {
  if (file === undefined) return "";
  return URL.createObjectURL(file);
}

export default CoverAndPicture;
