'use client';
import Carousel from '@/components/Carousel';
import List from '@/components/List';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

type CardData = {
    id: number,
    title: string,
    thumbnail: string,
    type: string,
    genre: string
}

interface MoviePageData{
  Action: CardData[],
  Comedy: CardData[],
  Drama: CardData[]
}


const MoviePage = () => {
  const [homeData, setHomeData] = useState<MoviePageData>({
  Action: [],
  Comedy: [],
  Drama: []
});
   
   const [loading, setLoading] = useState(true)




   const getContent = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_AP_URL}/videos/content/home?filter=movie`)
      const backendData = response.data;
      console.log(backendData)
      const groupedData: MoviePageData = {
        Action: [],
        Comedy: [],
        Drama: []
      }

      backendData.forEach((item: CardData) => {
        if(item.genre === "Action"){
          groupedData.Action.push(item);
        }else if(item.genre === "Comedy"){
          groupedData.Comedy.push(item)
        }else if(item.genre === "Drama"){
          groupedData.Drama.push(item)
        }
      })
      
      setHomeData(groupedData)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
 }

  useEffect(() => {
    getContent()
  }, [])


  return (
  
              <div>
      <Carousel />

      <div className="p-2 box-border w-full">
         <p className="text-2xl text-white font-bold pl-2">Action: </p>
          <List cards={homeData.Action} loading={loading}/>
      </div>
     

        <div className="p-2 box-border w-full">
         <p className="text-2xl text-white font-bold pl-2">Drama: </p>
          <List cards={homeData.Drama} loading={loading}/>
      </div>
        <div className="p-2 box-border w-full">
         <p className="text-2xl text-white font-bold pl-2">Comedy: </p>
          <List cards={homeData.Comedy} loading={loading}/>
      </div>
    </div>
   
    
 
 
  );
}

export default MoviePage