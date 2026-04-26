import React, { useState } from 'react'



type EpisodeData = {
   id: number;
   contentId: number;
   episode: number;
   path: string
}



const EpisodeCarousel = ({episodes, onSelectEpisode}: {episodes: EpisodeData[], onSelectEpisode: (ep: EpisodeData) => void} ) => {
   const [currentIndex, setCurrentIndex] = useState(0);

  

   const CARD_WIDTH = 350;
   const GAP = 16;
   const ITEMS_PER_SLIDE = 3;

   const handlePrev = () => {
    setCurrentIndex((prev) => 
    Math.max(prev - ITEMS_PER_SLIDE, 0)
    )
   }

   const handleNext = () => {
    setCurrentIndex((prev) => 
    Math.min(prev + ITEMS_PER_SLIDE, episodes.length - ITEMS_PER_SLIDE)
    )
   }

  return (
     <div className="w-4/5  relative overflow-hidden">
       <div className='flex gap-4 transition-transform duration-300'
       style={{
        transform: `translateX(-${currentIndex * (CARD_WIDTH + GAP)}px)`
       }}
       >
           {episodes.map((ep, index) => (
          <div key={index} 
          className="min-w-[350px] bg-gray-500 h-32 relative overflow-hidden rounded-md flex justify-center items-center hover:cursor-pointer gap-3"
          onClick={() => onSelectEpisode(ep)}
          >
            <img 
            src={'/cinema.jpg'}
            className='absolute inset-0 w-full h-full object-cover'
            />

              <div className="absolute inset-0 bg-black/40"></div>

            

              <div className="absolute inset-0 flex items-center justify-center">
    <p className="text-xl text-white font-semibold">
      Episode: {ep.episode}
    </p>
  </div>
          </div>
        ))}


       </div>
       <button
          onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❮
      </button>
      <button
         onClick={handleNext}
        disabled={currentIndex >= episodes.length - ITEMS_PER_SLIDE}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❯
      </button>
      </div>
  )
}

export default EpisodeCarousel