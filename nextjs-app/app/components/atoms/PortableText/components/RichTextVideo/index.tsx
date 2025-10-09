import React, { FC } from "react";
import { Video } from "@/sanity.types";

interface RichTextVideoProps {
  value: Video;
}

const RichTextVideo: FC<RichTextVideoProps> = ({ value }) => {
  const { videoId, videoType, videoUrl } = value || {};

  if (!videoType) {
    return null;
  }

  if (videoType === "youtube") {
    if (!videoId) {
      return null;
    }

    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-2xl shadow-md transition-shadow object-cover aspect-video"
      />
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <video
      className="h-full w-full rounded-2xl shadow-md transition-shadow object-cover aspect-video"
      controls
      src={videoUrl}
      preload="metadata"
    />
  );
};

export default RichTextVideo;
