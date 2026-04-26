"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


type CardData = {
    id: number,
    title: string,
    thumbnail: string,
    type: string,
    genre: string
}

const List = ({cards, loading}: {cards: CardData[], loading: boolean}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter()



  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300; // adjust for card size
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Just for demo – repeat the same image
  
  function handleRouting(id: number){
      window.location.href = `/video/play/${id}`;
  }

  return (
    <div className="relative w-full  p-2">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10"
      >
        <FontAwesomeIcon icon={faAngleLeft} size="lg" />
      </button>

      {/* Carousel */}
{/* <div ref={carouselRef} className="flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth h-full px-2" > 
  {loading ? [1,2,3,4,5].map((_) => <div key={_} className="skeleton h-full w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"></div>) : 
  cards.map((card) => ( 
  <div key={card.id} className=" flex-shrink-0 h-full rounded-lg overflow-hidden w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 cursor-pointer " 
  onClick={() => router.push(`/video/play/${card.id}`)} > 
  <img src={card.thumbnail} alt="Movie" className="w-full h-full object-contain" /> 
  </div> ))} </div> */}

<div
  ref={carouselRef}
  className="flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth h-80 px-2"
>
  {loading
    ? [1, 2, 3, 4, 5].map((_) => (
        <div
          key={_}
          className="skeleton flex-shrink-0 h-full w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 rounded-lg"
        />
      ))
    :  cards.map((card) => ( 
  <div key={card.id} className=" flex-shrink-0 h-full rounded-lg w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 cursor-pointer " 
  onClick={() => handleRouting(card.id)} > 
  <img src={card.thumbnail} alt="Movie" className="w-full h-full object-contain" /> 
  </div> ))}
</div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10"
      >
        <FontAwesomeIcon icon={faAngleRight} size="lg" />
      </button>
    </div>
  );
};

export default List;