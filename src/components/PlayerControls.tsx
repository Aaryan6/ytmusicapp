import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
} from "lucide-react";
import { SearchResult } from "@/services/youtube";
import Image from "next/image";

interface PlayerControlsProps {
  track: SearchResult;
  isPlaying: boolean;
  togglePlay: () => void;
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  track,
  isPlaying,
  togglePlay,
  duration,
  currentTime,
  onSeek,
  volume,
  onVolumeChange,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#181818] p-4 flex flex-col sm:flex-row items-center">
      <div className="flex items-center w-full sm:w-1/4 mb-4 sm:mb-0">
        <Image
          src={track.snippet.thumbnails.default.url}
          alt={track.snippet.title}
          className="w-14 h-14 mr-3 object-cover"
          width={500}
          height={500}
        />
        <div>
          <h4 className="font-medium text-sm line-clamp-2">
            {track.snippet.title}
          </h4>
          <p className="text-sm text-gray-400">{track.snippet.channelTitle}</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-4 hover:bg-[#282828]">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col items-center w-full sm:w-1/2">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="icon" className="hover:bg-[#282828]">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mx-2 hover:bg-[#282828]"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#282828]">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        <div className="w-full flex items-center">
          <span className="text-xs text-gray-400 mr-2">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => onSeek(value[0])}
            className="w-full"
          />
          <span className="text-xs text-gray-400 ml-2">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <div className="flex items-center w-full sm:w-1/4 justify-end mt-4 sm:mt-0">
        <Volume2 className="h-5 w-5 mr-2" />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={(value) => onVolumeChange(value[0])}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default PlayerControls;
