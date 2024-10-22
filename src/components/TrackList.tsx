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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

interface TrackListProps {
  tracks: SearchResult[];
  currentTrack: SearchResult | null;
  setCurrentTrack: (track: SearchResult) => void;
  toggleSidebar: () => void;
  onTrackSelect: (track: SearchResult) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  setCurrentTrack,
  toggleSidebar,
  onTrackSelect,
}) => {
  const handleTrackClick = (track: SearchResult) => {
    setCurrentTrack(track);
    onTrackSelect(track);
  };

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
                onClick={() => handleTrackClick(track)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center">
                  <div className="w-10 h-10 mr-3">
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        src={track.snippet.thumbnails.default.url}
                        alt={track.snippet.title}
                        className="object-cover w-full h-full"
                        width={40}
                        height={40}
                      />
                    </AspectRatio>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium line-clamp-1">
                      {track.snippet.title}
                    </h3>
                    <h3 className="text-sm text-muted-foreground md:hidden">
                      {track.snippet.channelTitle}
                    </h3>
                  </div>
                </TableCell>
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
