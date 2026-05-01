'use client';

import Carousel from "@/components/Carousel";
import List from "@/components/List";
import { socket } from "@/socket/socket";
import { clearAuth } from "@/store/authSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type CardData = {
    id: number,
    title: string,
    thumbnail: string,
    type: string,
    genre: string
}

interface HomePageData{
  Movie: CardData[],
  "Tv-Series": CardData[],
  Documentary: CardData[]
}



export default function Home() {
  const [homeData, setHomeData] = useState<HomePageData>({
  Movie: [],
  "Tv-Series": [],
  Documentary: []
});
   const dispatch = useDispatch()

   const [loading, setLoading] = useState(true)

   useEffect(() => {
  socket.on('connect', () => {
    console.log('Connected:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
}, [])

    useEffect(() => {
         const token = localStorage.getItem("token");
         if(token){
          try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if(decoded.exp! < currentTime){
                dispatch(clearAuth())
            }

          } catch (error) {
            dispatch(clearAuth())
          }
         }
    }, [dispatch])


   const getContent = async () => {
    try {
      const response = await axios.get('http://localhost:3000/videos/content/home')
      const backendData = response.data;
      console.log(backendData)
      const groupedData: HomePageData = {
        Movie: [],
        "Tv-Series": [],
        Documentary: []
      }

      backendData.forEach((item: CardData) => {
        if(item.type === "Movie"){
          groupedData.Movie.push(item);
        }else if(item.type === "Tv-Series"){
          groupedData["Tv-Series"].push(item)
        }else if(item.type === "Documentary"){
          groupedData.Documentary.push(item)
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
         <p className="text-2xl text-white font-bold pl-2">Movies: </p>
          <List cards={homeData.Movie} loading={loading}/>
      </div>
     

        <div className="p-2 box-border w-full">
         <p className="text-2xl text-white font-bold pl-2">Tv Series: </p>
          <List cards={homeData["Tv-Series"]} loading={loading}/>
      </div>
        <div className="p-2 box-border w-full">
         <p className="text-2xl text-white font-bold pl-2">Documentary: </p>
          <List cards={homeData.Documentary} loading={loading}/>
      </div>
    </div>
   
    
 
 
  );
}
