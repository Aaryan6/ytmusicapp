interface Video {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onVideoSelect }) => {
  return (
    <div className="overflow-y-auto h-[315px]">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onVideoSelect(video)}
        >
          <img
            src={video.snippet.thumbnails.default.url}
            alt={video.snippet.title}
            className="w-20 h-20 object-cover mr-4"
          />
          <p className="text-sm">{video.snippet.title}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
