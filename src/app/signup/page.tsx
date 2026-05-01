'use client';

import { setToken } from "@/store/authSlice";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


const SignUpPage = () => {
      const dispatch = useDispatch()
      const router = useRouter()
      const [formData, setFormData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        password: ''
      })

      const signUp = async() => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_AP_URL}/users/signup`, formData);
          console.log(response.data);
         
          if(response.status === 200){
               dispatch(setToken(response.data.token))
               router.push('/')
               toast.success(`Welcome ${formData.firstname}`)
          }
        
        } catch (error) {
              if(axios.isAxiosError(error)){
        if(error.response){
          toast.error(error.response.data.message)
        }else{
          toast.error("Server error")
        }
       }else{
        console.log(error)
        toast.error("Unknown error, try later!")
       }
        }
      }

      const Login = async() => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_AP_URL}/users/login`, formData);
          console.log(response.data)

          if(response.status === 200){
            dispatch(setToken(response.data.token))
            router.push('/')

          }else{
            toast.error(response.data.message)
          }
        } catch (error) {
              if(axios.isAxiosError(error)){
        if(error.response){
          toast.error(error.response.data.message)
        }else{
          toast.error("Server error")
        }
       }else{
        console.log(error)
        toast.error("Unknown error, try later!")
       }
        }
      }

    return (
        <div className="flex w-full h-screen">
            <div className="flex-1 w-1/2">
                      <img src='background.png' alt="Movie" className="w-full h-full object-cover" />
            </div>
              <div className="flex flex-1 w-1/2 justify-center items-center ">
                <div className="flex flex-col w-1/2 h-[500px] items-center gap-10">
                      <p className="text-white text-5xl">VideoMotion</p>

                    <div className="flex flex-col gap-4">
               <div className="relative w-full">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 12H8m0 0l4-4m-4 4l4 4"
      />
    </svg>
  </span>
  <input
    className="w-full pl-10 bg-black border border-white text-white rounded px-3 py-2"
    type="email"
    placeholder="mail@site.com"
    required
    onChange={(e) => setFormData({...formData, email: e.target.value})}
  />
</div>

      <div className="relative w-full">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
   <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </g>
  </svg>
  </span>
  <input
    className="w-full pl-10 bg-black border border-white text-white rounded px-3 py-2"
    type="text"
    placeholder="Firstname"
    required
    onChange={(e) => setFormData({...formData, firstname: e.target.value})}
  />


</div>

        <div className="relative w-full">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
   <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </g>
  </svg>
  </span>
      <input
    className="w-full pl-10 bg-black border border-white text-white rounded px-3 py-2"
    type="text"
    placeholder="Lastname"
    required
    onChange={(e) => setFormData({...formData, lastname: e.target.value})}
  />


</div>


 

    <div className="relative w-full">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      ></path>
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
    </g>
  </svg>
  </span>
  <input
    className="w-full pl-10 bg-black border border-white text-white rounded px-3 py-2"
    type="password"
    placeholder="Password"
    required
        onChange={(e) => setFormData({...formData, password: e.target.value})}
  />
</div>
</div>

   <div className="flex gap-4 w-full justify-center">
      <button className="btn bg-black text-white"
      onClick={Login}
      >Login</button>
  <button 
  onClick={signUp}
  className="btn bg-black text-white">Signup</button>
   </div>



                </div>
            </div>
        </div>
    )
}

export default SignUpPage;