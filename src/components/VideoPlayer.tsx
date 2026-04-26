'use client';

import React, { useEffect, useRef } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';

// Import plugins
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';
// (Optionally import plugin CSS here if available)

interface VideoPlayerProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ options, onReady }) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    if (!videoNode.current) return;

    const player = videojs(videoNode.current, options, () => {
      if (typeof player.httpSourceSelector === 'function') {
        player.httpSourceSelector({
          displayCurrentQuality: true,
          defaultQuality: 'auto',
        });
      }

      onReady?.(player);
    });

    playerRef.current = player;

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, []);

  return (
    <div data-vjs-player className="w-full">
      <video ref={videoNode} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;








