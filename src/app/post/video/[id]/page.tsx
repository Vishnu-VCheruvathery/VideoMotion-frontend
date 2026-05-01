'use client'
import { socket } from '@/socket/socket'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid';

type ContentData = {
    id: string | null;
    title: string;
    description: string;
    type: string
}


const UploadPage = () => {

  const params = useParams()
   const [videoRef, setVideoRef] = useState<File| null>(null)
   const [progress, setProgress] = useState<number | null>(null)
   const [contentData, setContentData] = useState<ContentData | null>(null)
   const [episode, setEpisode] = useState(0)
   const getContent = async() =>{
      try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_AP_URL}/videos/content?id=${params.id}`)
         console.log(response.data)
         if(response.status === 200){
            setContentData(response.data.content)
         }
      } catch (error) {
             if(axios.isAxiosError(error)){
        if(error.response){
          toast.error(error.response.data.message)
        }else{
          toast.error("Server error, can't fetch data")
        }
       }else{
        console.log(error)
        toast.error("Unknown error, try later!")
       }
      }
   }

   const uploadVideo = async() => {
      const taskId = uuidv4();

       socket.emit('join-job', taskId)
    try {

        const formData = new FormData();
        formData.append('title', contentData?.title ?? 'Undefined');
        formData.append('contentId',  contentData?.id ?? '')
        if(episode > 0){
           formData.append('episode', episode.toString())
        }
        formData.append('file', videoRef as Blob)
        formData.append('taskId', taskId)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_AP_URL}/videos/upload`, formData)
        console.log(response.data);
        if(response.status === 200){
        
         toast.success(response.data.message);
        }
    } catch (error) {
         console.log(error)
        toast.error("Unknown error, try later!")
    }
   }

useEffect(() => {
  const handler = (data: number) => {
    console.log('progress:', data)
    setProgress(data)
  }

  socket.on('progress', handler)

  return () => {
    socket.off('progress', handler)
  }
}, []) 

   useEffect(() => {
     getContent()
   }, [])


function handleEpisode(event: React.ChangeEvent<HTMLInputElement>) {
  const value = Number(event.target.value);
  setEpisode(value);
}
  return (
      <div className="min-h-screen w-full flex flex-col items-center gap-10 box-border p-4">
          <div className="w-full p-4">
                <p className="text-white text-3xl">Upload Video: </p>
                </div>

             <div className='w-4/5 h-64 border  rounded-lg box-border bg-white flex flex-col flex-1'>
             <div className='w-full flex justify-between items-center h-50px bg-black p-4'>
                <p className='text-white'>Video details: </p>
                <div className="tooltip" data-tip="Edit">
                   <img className='w-8 h-8 invert brightness-0 cursor-pointer' src="/edit.png"/>
                </div>
               
                </div>
             <div className='p-4 w-full flex justify-between items-center'>
                <p>Title: {contentData?.title ?? '...Loading'}</p>

                <p>Type: {contentData?.type ?? '...Loading'}</p>
             </div>
               
             <div className='p-4'>
                <p>Description:</p>
                <p>{contentData?.description ?? '...Loading'}</p>
                </div>    

             </div>
             {progress !== null && progress < 100 ? (
<div
  className="radial-progress bg-primary text-primary-content border-primary border-4"
  style={{ "--value": progress } as React.CSSProperties}
  role="progressbar"
>
  {progress}%
</div>
) : (
  <div className="w-4/5">
    <p className="text-white text-xl">Video:</p>
    <input
      onChange={(e) => setVideoRef(e.target.files?.[0] ?? null)}
      type="file"
      className="w-full text-white p-4 mt-4 border border-white rounded"
    />
  </div>
)}
          
            {contentData?.type !== 'Movie' ?    <div className='w-4/5'>
              <p className="text-white text-xl pb-4">Episode Number:</p>
               <input
  type="number"
  className="input validator"
  required
  placeholder="Select Number"
  min="1"
  onChange={handleEpisode}
/>
                </div>  : null}
         

                       <button
 
  className="px-6 py-2 bg-white text-black rounded cursor-pointer"
  onClick={uploadVideo}
>
  Submit
</button>     
      </div>
  )
}

export default UploadPage