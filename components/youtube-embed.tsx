"use client";

import { getYoutubeId } from "@/lib/utils";

const YoutubeEmbed = ({ src }: { src: string }) => {
  const id = getYoutubeId(src);
  return (
    <div className="grid w-full place-items-center">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        allowFullScreen
        title="Embedded youtube"
        className="aspect-video w-full max-w-[800px] rounded-md"
      />
    </div>
  );
};

export default YoutubeEmbed;
