import React, { useState, useRef, useEffect } from "react";
import PlayerControls from "./PlayerControls";

interface VideoPlayerProps {
  video: {
    id: string;
    snippet: {
      title: string;
    };
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Note: volume control might not work with YouTube iframe
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player(videoRef.current!, {
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              startTimeUpdate();
            } else {
              stopTimeUpdate();
            }
          },
        },
      });
    };
  }, [video.id]);

  const startTimeUpdate = () => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  const stopTimeUpdate = () => {
    // Implement stop time update logic
  };

  // Update togglePlay function
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

  return (
    <div>
      <h2 className="text-sm line-clamp-3 font-semibold mb-2">
        {video.snippet.title}
      </h2>
      <iframe
        ref={videoRef}
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${video.id}`}
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <PlayerControls
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        duration={duration}
        currentTime={currentTime}
        onSeek={(time) => setCurrentTime(time)}
        track={{
          snippet: {
            title: video.snippet.title,
            channelTitle: "",
            thumbnails: {
              default: {
                url: "",
              },
            },
          },
          id: {
            videoId: video.id,
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
