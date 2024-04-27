"use client";
import { compressImage } from "@/lib/utils";
import { ShowAvatar } from "../shared/show-avatar";
import { Image, X } from "lucide-react";

interface props {
  initImage: string | null;
  userName: string | null;
  image: {
    file: File | undefined;
    setImage: (file: File | undefined) => void;
  };
}

const ChangeProfileImage = ({ initImage, userName, image }: props) => {
  return (
    <div className="relative w-fit">
      <ShowAvatar
        data={{
          name: userName,
          image: image.file ? getImagePreview(image.file) : initImage,
        }}
        className="size-20"
      />
      <input
        id="avatar"
        type="file"
        accept="image/png, image/jpeg"
        onChange={async (e) => {
          const file = e.target.files![0];
          const compressedFile: File = await compressImage(file, {
            quality: 0.8,
            type: "image/jpeg",
          });

          image.setImage(compressedFile);
        }}
        hidden
      />
      <label
        htmlFor="avatar"
        className="absolute inset-0 z-10 grid cursor-pointer place-content-center rounded-full bg-foreground/20 text-muted-foreground"
      >
        {!image.file ? <Image size="16" /> : null}
      </label>
      {image.file && (
        <X
          className="absolute right-1 top-1 cursor-pointer rounded-full bg-muted text-foreground shadow-md"
          size="16"
          onClick={() => image.setImage(undefined)}
        />
      )}
    </div>
  );
};

function getImagePreview(file: File | undefined) {
  if (file === undefined) return "";
  return URL.createObjectURL(file);
}

export default ChangeProfileImage;
