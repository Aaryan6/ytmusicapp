interface VideoPlayerProps {
  video: {
    id: string;
    snippet: {
      title: string;
    };
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{video.snippet.title}</h2>
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${video.id}`}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
