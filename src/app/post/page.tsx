'use client'

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import {socket} from '../../socket/socket' 
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { loadAuthFromStorage } from "@/store/authSlice"

import { useRouter } from "next/navigation"

const PostPage = () => {
    const auth = useSelector((state: RootState) => state.auth)
    const router = useRouter();
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnailRef, setThumbnailRef] = useState<File | null>(null)
    const [genre, setGenre] = useState('')
   
    const [type, setType] = useState("Movie");

     const handleSubmit = async() => {
        if(auth.user){
         const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('userId', auth.user?.id)
        formData.append('file', thumbnailRef as Blob);
        formData.append('genre', genre)
        formData.append('type', type)
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_AP_URL}/videos/post`, formData)
            console.log(response.data)
            if(response.status === 200 && response.data){
                toast.success(response.data.message)
                router.push(`/post/video/${response.data.id}`)
            }
        } catch (error) {
            console.log('the error: ',error);
        }
        }else{
            toast.error('Please login first!')
            console.log(auth.user)
        }
     }   
   

   
   


    return (
        <div className="min-h-screen w-full flex flex-col items-center gap-10 box-border p-4">
            <div className="w-full p-4">
                <p className="text-white text-3xl">Upload Info: </p>
                </div>  
            <div className="w-4/5">
                <p className="text-white text-xl">Title:</p>
                <input onChange={(e) => setTitle(e.target.value)} type="text" className="w-full text-white p-4 mt-4 border border-white rounded"/>
            </div>
              <div className="w-4/5">
                <p className="text-white text-xl">Description:</p>
                <textarea onChange={(e) => setDescription(e.target.value)} className="textarea w-full text-white p-4 mt-4 border border-white rounded bg-transparent h-24"></textarea>
            </div>
              <div className="w-4/5">
                <p className="text-white text-xl">Genre:</p>
                <input onChange={(e) => setGenre(e.target.value)} type="text" className="w-full text-white p-4 mt-4 border border-white rounded"/>
            </div>
             <div className="w-4/5">
                <p className="text-white text-xl">Select Type</p>
               <select
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="w-full text-white bg-gray-900 p-4 mt-4 border border-white rounded"
>
  <option value="Movie">Movie</option>
  <option value="Tv-Series">Tv-Series</option>
  <option value="Documentary">Documentary</option>
</select>
             </div>

             <div className="w-4/5">
                <p className="text-white text-xl">Thumbnail:</p>
               <input onChange={(e) => setThumbnailRef(e.target.files?.[0] ?? null)} type="file" className="w-full text-white p-4 mt-4 border border-white rounded"/>
            </div>

           



            <button
  onClick={handleSubmit}
  className="px-6 py-2 bg-white text-black rounded cursor-pointer"
>
  Submit
</button>
        </div>
    )
}

export default PostPage