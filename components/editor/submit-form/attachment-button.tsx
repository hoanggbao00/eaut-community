"use client";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { checkYoutubeUrl, compressImage } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface props {
  youtubeUrl: string;
  setYouTubeUrl: (value: string) => void;
  setYoutubeValid: (value: boolean) => void;
  isYoutubeValid: boolean;
  setAttachment: (value: File | undefined) => void;
  setPreview: (value: string) => void;
}

const AttachmentButton: React.FC<props> = ({
  youtubeUrl,
  setYouTubeUrl,
  setYoutubeValid,
  isYoutubeValid,
  setAttachment,
  setPreview,
}) => {
  const handleYoutubeUrl = () => {
    const isValid = checkYoutubeUrl(youtubeUrl);

    if (!isValid)
      return toast({
        title: "Link youtube không hợp lệ",
        variant: "destructive",
      });
    setPreview("");
    setAttachment(undefined);
    setYoutubeValid(isValid);
  };

  return (
    <div className="my-2 space-y-2">
      {!isYoutubeValid && (
        <Label
          htmlFor="attachment"
          className={buttonVariants({
            variant: "outline",
            className: "mr-2 cursor-pointer",
          })}
        >
          Đính kèm ảnh
        </Label>
      )}
      <div className="relative inline-block min-w-[300px]">
        <Input
          value={youtubeUrl}
          onChange={(e) => setYouTubeUrl(e.target.value)}
          placeholder="hoặc thêm youtube link..."
          type="url"
          className="w-full pr-14"
        />
        <Button
          onClick={() => handleYoutubeUrl()}
          disabled={!!!youtubeUrl}
          className="absolute right-0.5 top-1/2 -translate-y-1/2 p-1 text-sm"
          size="sm"
          type="button"
        >
          Kiểm tra
        </Button>
      </div>
      {youtubeUrl && 
        <Button
          variant="outline"
          size="sm"
          className="ml-1 p-1"
          type="button"
          onClick={() => {
            setYouTubeUrl("");
            setYoutubeValid(false);
          }}
        >
          Xóa URL Youtube
        </Button>
      }
      <input
        id="attachment"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        hidden
        onChange={async (e) => {
          const resizeImage = await compressImage(e.target.files![0], {
            quality: 0.8,
            type: "image/webp",
          });
          setAttachment(resizeImage);
          const previewUrl = URL.createObjectURL(resizeImage);
          setPreview(previewUrl);
        }}
      />
    </div>
  );
};

export default AttachmentButton;
