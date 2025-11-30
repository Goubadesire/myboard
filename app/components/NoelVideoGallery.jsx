"use client";

import { useState } from "react";

export default function NoelVideos({ videos }) {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  return (
    <div className="w-full mt-10">

      {/* === LECTEUR PRINCIPAL === */}
      <div className="w-full rounded-xl overflow-hidden shadow-xl border border-base-300">
        <iframe
          className="w-full h-64 md:h-96"
          src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
          title={currentVideo.title}
          allowFullScreen
        ></iframe>
      </div>

      <h2 className="text-xl font-bold mt-4 mb-3 text-primary">
        {currentVideo.title}
      </h2>

      {/* === MINIATURES DES AUTRES VIDÉOS === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {videos.map((video, index) => (
          <div
            key={index}
            onClick={() => setCurrentVideo(video)}
            className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:scale-105 transition duration-300 border border-base-300 bg-base-100"
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-28 object-cover"
            />

            <div className="p-2">
              <h3 className="text-sm font-semibold line-clamp-1">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
