"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Search,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { searchVideos, SearchResult } from "../services/youtube";

interface Video {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

// Add this type declaration at the top of the file
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT) {
        initializePlayer();
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId: currentVideoId,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: onPlayerReady,
          onError: onPlayerError,
        },
      });
    };

    loadYouTubeAPI();
  }, []);

  useEffect(() => {
    if (playerRef.current && currentVideoId) {
      playerRef.current.loadVideoById(currentVideoId);
    }
  }, [currentVideoId]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    console.log("Player ready");
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    console.log("Player state changed:", event.data);
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    if (event.data === window.YT.PlayerState.PLAYING) {
      setDuration(event.target.getDuration());
    }
  };

  const onPlayerError = (event: YT.OnErrorEvent) => {
    setError(`YouTube Player Error: ${event.data}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (newValue: number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newValue[0], true);
      setCurrentTime(newValue[0]);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newValue[0]);
      setVolume(newValue[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setError("Please enter a search query.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchVideos(searchQuery);
      if (results && results.length > 0) {
        const videoResults: Video[] = results.map((result: SearchResult) => ({
          id: result.id.videoId,
          snippet: {
            title: result.snippet.title,
            thumbnails: {
              default: {
                url: result.snippet.thumbnails.default.url,
              },
            },
            channelTitle: result.snippet.channelTitle,
          },
        }));
        setPlaylist(videoResults);
        setCurrentVideo(videoResults[0]);
        setCurrentVideoId(videoResults[0].id);
      } else {
        setError("No results found. Please try a different search query.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const playVideo = (video: Video) => {
    setCurrentVideoId(video.id);
    setCurrentVideo(video);
    if (playerRef.current) {
      playerRef.current.loadVideoById(video.id);
      playerRef.current.playVideo();
      setIsPlaying(true);
    } else {
      // If the player is not initialized yet, initialize it with the selected video
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId: video.id,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: (event) => {
            onPlayerReady(event);
            event.target.playVideo();
          },
          onError: onPlayerError,
        },
      });
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        <div id="youtube-player" className="w-full aspect-video mb-4"></div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for a song"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {playlist.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md">
              <h2 className="text-lg font-semibold p-2 bg-gray-100">
                Search Results
              </h2>
              {playlist.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer border-t"
                  onClick={() => playVideo(video)}
                >
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-1">
                      {video.snippet.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentVideo && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Now Playing</h2>
              <div className="flex items-center gap-2">
                <img
                  src={currentVideo.snippet.thumbnails.default.url}
                  alt={currentVideo.snippet.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <h3 className="text-sm font-medium">
                    {currentVideo.snippet.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentVideo.snippet.channelTitle}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleTimeChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              className="p-3 bg-primary hover:bg-primary/90 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
