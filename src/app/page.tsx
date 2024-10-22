"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import Sidebar from "@/components/Sidebar";
import TrackList from "@/components/TrackList";
import NowPlaying from "@/components/NowPlaying";
import PlayerControls from "@/components/PlayerControls";
import { searchVideos, SearchResult } from "@/services/youtube";
import { getRecentSearches, addRecentSearch } from "@/utils/localStorage";
import { loadScript } from "@/utils/loadScript";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Home() {
  const [tracks, setTracks] = useState<SearchResult[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SearchResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadScript("https://www.youtube.com/iframe_api")
      .then(() => {
        window.onYouTubeIframeAPIReady = () => {
          setIsYouTubeApiReady(true);
        };
      })
      .catch((error) => console.error("Error loading YouTube API:", error));

    const searches = getRecentSearches();
    setRecentSearches(searches);
    setSearchQuery(searches.length > 0 ? searches[0] : "music");
  }, []);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchTracks = async () => {
      try {
        const results = await searchVideos(searchQuery);
        setTracks(results);
        if (results.length > 0 && !currentTrack) {
          setCurrentTrack(results[0]);
        }
        addRecentSearch(searchQuery);
        setRecentSearches(getRecentSearches());
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, [searchQuery, currentTrack]);

  useEffect(() => {
    if (!isYouTubeApiReady || !playerContainerRef.current || !currentTrack)
      return;

    const initializePlayer = () => {
      if (playerContainerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          height: "0",
          width: "0",
          videoId: currentTrack.id.videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isYouTubeApiReady, currentTrack]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTrackSelect = (track: SearchResult) => {
    setCurrentTrack(track);
    if (playerRef.current) {
      playerRef.current.loadVideoById(track.id.videoId);
      setIsPlaying(true);
    }
  };

  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onSearch={handleSearch}
          recentSearches={recentSearches}
        />
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onTrackSelect={handleTrackSelect}
            isPlaying={isPlaying}
          />
          {currentTrack && <NowPlaying track={currentTrack} />}
        </div>
      </div>
      {currentTrack && (
        <PlayerControls
          track={currentTrack}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          duration={duration}
          currentTime={currentTime}
          onSeek={(time) => playerRef.current?.seekTo(time, true)}
          volume={volume}
          onVolumeChange={(newVolume) => {
            setVolume(newVolume);
            playerRef.current?.setVolume(newVolume);
          }}
        />
      )}
      <div
        ref={playerContainerRef}
        id="youtube-player"
        style={{ display: "none" }}
      ></div>
    </Layout>
  );
}
