import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SearchResult } from "@/services/youtube";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import PlayingAnimation from "./PlayingAnimation";
import Image from "next/image";

interface TrackListProps {
  tracks: SearchResult[];
  currentTrack: SearchResult | null;
  setCurrentTrack: (track: SearchResult) => void;
  toggleSidebar: () => void;
  onTrackSelect: (track: SearchResult) => void;
  isPlaying: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  onTrackSelect,
  toggleSidebar,
  isPlaying,
}) => {
  if (!tracks || tracks.length === 0) {
    return <div>No tracks available</div>;
  }

  return (
    <div className="flex-1 p-4 pr-0">
      <ScrollArea className="h-full pr-4">
        <div className="md:hidden mb-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Channel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.map((track, index) => (
              <TableRow
                key={track.id.videoId}
                className={`cursor-pointer ${
                  track.id.videoId === currentTrack?.id.videoId
                    ? "bg-muted"
                    : ""
                }`}
                onClick={() => onTrackSelect(track)}
              >
                <TableCell>
                  {track.id.videoId === currentTrack?.id.videoId &&
                  isPlaying ? (
                    <PlayingAnimation />
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="">
                  <div className="relative w-full h-auto aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={track.snippet.thumbnails.default.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      fill
                    />
                  </div>
                </TableCell>
                <TableCell>{track.snippet.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {track.snippet.channelTitle}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TrackList;
