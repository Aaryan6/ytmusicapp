import React from "react";
import { SearchResult } from "@/services/youtube";
import Image from "next/image";

interface NowPlayingProps {
  track: SearchResult;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ track }) => {
  return (
    <div className="w-full md:w-80 p-6 bg-[#181818] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
      <Image
        src={track.snippet.thumbnails.default.url}
        alt={track.snippet.title}
        className="w-full mb-4 object-cover"
        width={500}
        height={500}
      />
      <h3 className="text-base font-semibold">{track.snippet.title}</h3>
      <p className="text-gray-400">{track.snippet.channelTitle}</p>
    </div>
  );
};

export default NowPlaying;
