"use server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface SearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

export interface VideoData {
  id: string;
  snippet: {
    title: string;
    description: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
}

export async function getVideoData(videoId: string): Promise<VideoData[]> {
  const response = await fetch(
    `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch video data");
  }

  const data = await response.json();
  return data.items;
}

export async function searchVideos(query: string): Promise<SearchResult[]> {
  const url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`;

  console.log("API request URL:", url.replace(YOUTUBE_API_KEY!, "API_KEY"));

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API Error:", errorText);
      throw new Error(
        `Failed to fetch videos: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data = await response.json();
    console.log("YouTube API Response:", data);
    return data.items;
  } catch (error) {
    console.error("Error in searchVideos:", error);
    throw error;
  }
}
