'use client';

import Carousel from "@/components/Carousel";
import CommentSection from "@/components/CommentSection";
import EpisodeCarousel from "@/components/EpisodeCarousel";
import List from "@/components/List";
import VideoPlayer from "@/components/VideoPlayer";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type videojs from "video.js";

type Video = {
   id: number,
        contentId: number,
      path: string,
        episode: number
}


interface Content{
    id: number | null
    title: string | null,
    description: string | null,
    type: string | null,
    genre: string | null,
    videos: Video[]
}


type CardData = {
    id: number,
    title: string,
    thumbnail: string,
    type: string,
    genre: string
}




const VideoPage: React.FC = () => {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const playerRef = useRef<videojs.Player | null>(null);
  const [contentData, setContentData] = useState<Content | null>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [similar, setSimilar] = useState<CardData[]>([])
  const [currentEpisode, setCurrentEpisode] = useState<Video | null>(null);

const [loading, setLoading] = useState(true)
  const initialOptions: videojs.PlayerOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    // leave sources empty; will set later via .src()
  };

const getContent = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_AP_URL}/videos/content?id=${id}`
    );

    if (response.status === 200) {
      let content = response.data.content;
      console.log('the content: ',content)
      if (content.type === 'Tv-Series') {
        const sortedEpisodes = [...content.videos].sort(
          (a, b) => a.episode - b.episode
        );

        content = {
          ...content,
          videos: sortedEpisodes // 🔥 replace videos with sorted ones
        };
      }

      if (content.videos?.length > 0) {
  setCurrentEpisode(content.videos[0]);
}
      setContentData(content);

    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error, can't fetch data");
      }
    } else {
      console.log(error);
      toast.error("Unknown error, try later!");
    }
  }
};

  const getContentLikeThis = async() => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_AP_URL}/videos/content/genre?filter=${contentData?.genre}`)
      if(response.status === 200){
        setSimilar(response.data)
      }
    } catch (error) {
      console.log(error);
      toast.error("Unknown error, try later!");
    }
  }



  useEffect(() => {
  if (id) getContent();
  getContentLikeThis()
}, [id]);

useEffect(() => {
  if (!isPlayerReady || !currentEpisode) return;

  const player = playerRef.current;
  if (!player) return;

  console.log("SETTING VIDEO:", currentEpisode.path);

  player.pause();
  player.reset();

  player.src({
    src: currentEpisode.path,
    type: "application/x-mpegURL",
  });

  player.load();
}, [isPlayerReady, currentEpisode]);

useEffect(() => {
  console.log("READY:", isPlayerReady);
  console.log("DATA:", contentData);
}, [isPlayerReady, contentData]);

const handlePlayerReady = (player: videojs.Player) => {
  playerRef.current = player;
  setIsPlayerReady(true);

  player.on("waiting", () => {
    console.log("player is waiting");
  });

  player.on("dispose", () => {
    console.log("player will dispose");
  });
};




  return (
    <div className="min-h-screen w-screen flex flex-col items-center box-border bg-black gap-2">


         <div className="w-4/5 flex flex-col items-center m-4 box-border flex-initial">
  <VideoPlayer
  key={id} // 🔥 forces clean re-init
  options={initialOptions}
  onReady={handlePlayerReady}
/>
</div>

    <div className="w-4/5 border border-gray-200 h-[200px] rounded-md p-2">
      <div className="w-full flex justify-between">
        <p className="text-white text-2xl font-bold">{contentData?.title}</p>
        {contentData?.type == 'Tv-Series' ? <p className="text-white text-xl font-bold">Episode: {currentEpisode?.episode}</p> : null}
      </div>
      <div className="w-full mt-5">
        <p className="text-white text-2xl">Description:</p>
        <p className="text-white text-lg">{contentData?.description}</p>
      </div>
    </div>


     {contentData?.type == 'Tv-Series' ?    <EpisodeCarousel episodes={contentData.videos}  onSelectEpisode={(ep) => setCurrentEpisode(ep)}/> : null}
  

    
  <CommentSection id={Number(params.id)}/>

    {similar.length > 0 ?   <div className="p-2 box-border w-full">
         <p className="text-2xl text-white font-bold pl-2">Similar to this: </p>
          <List cards={similar} loading={loading} />
      </div> : null}
   

    </div>
   
  );
};

export default VideoPage;


