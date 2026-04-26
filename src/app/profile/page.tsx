'use client';

import { updateUserDetails } from '@/store/authSlice';
import { RootState } from '@/store/store';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

type UserData = {
   id: string;
    firstname: string;
    lastname: string;
    email: string;
    type: string;
    profile: string | null 

}

type BackendData = {
  firstname: string;
  lastname: string;
  email: string;
  profile? : string
}




const Profile = () => {
   const auth = useSelector((state: RootState) => state.auth);
   const dispatch = useDispatch()
   const [showInputs, setShowInputs] = useState(false)
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [previewImage, setPreviewImage] = useState<string | null>(null);

   const [userData, setUserData] = useState<UserData | null>(null)

   const [newData, setNewData] = useState<UserData | null>(null)

   const [editMaps , setEditMaps] = useState({
    firstname: false,
    lastname: false,
    email: false,
    profile: false
   })

   useEffect(() => {
  if (auth.user) {
    setUserData(auth.user);
    setNewData(auth.user)
  }
}, [auth.user]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setSelectedFile(e.target.files?.[0] ?? null)
    setNewData((prev) => {
      if(!prev) return prev;
      return{
        ...prev,
        profile: previewUrl,
      }
    })

   }

    const handleEditClick = () => {
      fileInputRef.current?.click()
    }

    const handleCancel = () => {
      setNewData(auth.user)
      setShowInputs(!showInputs)
      setPreviewImage(null)
    }

   const updateDetails = async () => {
  const formData = new FormData();

  if (newData && auth.user) {
    formData.append('id', auth.user.id);
    formData.append('firstname', newData.firstname);
    formData.append('lastname', newData.lastname);
    formData.append('email', newData.email);

    if (selectedFile) {
      formData.append('file', selectedFile);
    }
  }

  try {
    const response = await axios.post(
      'http://localhost:3000/users/update',
      formData
    );

    if (response.status === 200) {
      const updatedUser = response.data;
    
      // update local state
      setUserData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...updatedUser,
          profile: `${updatedUser.profile}?t=${Date.now()}` // 🔥 cache bust
        };
      });

      // update redux
      dispatch(updateUserDetails({
        ...auth.user,
        ...updatedUser,
        profile: `${updatedUser.profile}?t=${Date.now()}`
      }));

      setShowInputs(false);
      toast.success('User details updated!');
    }
  } catch (error) {
    console.log(error);
  }
};

 


  return (
<div className="w-full flex justify-center items-center h-[700px] bg-[#0a0a0a]">

  {/* Card */}
  <div className="card w-[400px] h-[400px] relative rounded-2xl 
    bg-gradient-to-b from-[#111] to-black 
    border border-gray-800
    shadow-[0_20px_60px_rgba(0,0,0,0.8)]
   flex flex-col
   gap-2
   items-center
  ">

    {/* Avatar */}
<div className="absolute -top-16 left-1/2 -translate-x-1/2">

  {/* Wrapper MUST be relative */}
  <div className="relative w-32">

    {/* Avatar */}
    <div className="w-32 aspect-square rounded-full p-[3px] 
      bg-gradient-to-tr from-gray-700 via-gray-500 to-gray-700
      shadow-[0_10px_30px_rgba(0,0,0,0.9)]
    ">
      <div className="w-full h-full rounded-full overflow-hidden bg-black">
        <img
          src={previewImage ||  userData?.profile || '/default.jpg'}
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    {/* 🔥 Edit Button */}
    {showInputs ?  <button
    onClick={handleEditClick}
    className="absolute bottom-0 right-0 translate-x-[-5%] translate-y-[-5%]
      w-10 h-10 rounded-full bg-white border border-gray-600 
      flex items-center justify-center shadow-lg hover:scale-105 transition
      tooltip tooltip-bottom tooltip-info
      "
      data-tip="Edit"
    >
      <img
        src="/edit.png"
        className="w-5 h-5 object-contain"
      />
      <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  onChange={handleFileChange}
  className="hidden"
/>

    </button> : null}
   

  </div>

 

</div>
  
    <div className='flex w-80 justify-between  p-2 mt-20'>
       <p className='text-lg text-[#c9c8c7]'>First-Name:</p>
       <div className='flex gap-2'>
        {editMaps.firstname ? <input
  type="text"
  value={newData?.firstname || ""}
  onChange={(e) =>
    setNewData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        firstname: e.target.value
      };
    })
  }
  className="input"
/>: <p className='text-lg text-[#c9c8c7]'>{userData?.firstname}</p>}
          
              {showInputs ? <button className="
      w-8 h-8 rounded-full bg-white border border-gray-600 
      flex items-center justify-center shadow-lg hover:scale-105 transition
      tooltip tooltip-bottom tooltip-info
      "
      data-tip="Edit"
     onClick={() =>
  setEditMaps((prev) => ({
    ...prev,
    firstname: !editMaps.firstname
  }))
}
    >
      <img
        src="/edit.png"
        className="w-5 h-5 object-contain"
      />
    </button> : null} 
       </div>
    

   </div>
    
        <div className='flex w-80 justify-between p-2'>
       <p className='text-lg text-[#c9c8c7]'>Last-Name:</p>
       <div className='flex gap-2'>
        {editMaps.lastname ? <input
  type="text"
  value={newData?.lastname || ""}
  onChange={(e) =>
    setNewData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lastname: e.target.value
      };
    })
  }
  className="input"
/> : <p className='text-lg text-[#c9c8c7]'>{userData?.lastname}</p>}

              {showInputs ? <button className="
      w-8 h-8 rounded-full bg-white border border-gray-600 
      flex items-center justify-center shadow-lg hover:scale-105 transition
      tooltip tooltip-bottom tooltip-info
      "
      data-tip="Edit"
          onClick={() =>
  setEditMaps((prev) => ({
    ...prev,
    lastname: !editMaps.lastname
  }))
}
    >
      <img
        src="/edit.png"
        className="w-5 h-5 object-contain"
      />
    </button> : null} 
       </div>
    

   </div>


     <div className='flex w-80 justify-between  p-2'>
       <p className='text-md text-[#c9c8c7]'>Email:</p>
        <div className='flex gap-2'>
          {editMaps.email ? <input
  type="text"
  value={newData?.email || ""}
  onChange={(e) =>
    setNewData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        email: e.target.value
      };
    })
  }
  className="input"
/> : <p className='text-lg text-[#c9c8c7]'>{userData?.email}</p>}
            {showInputs ? <button className="
      w-8 h-8 rounded-full bg-white border border-gray-600 
      flex items-center justify-center shadow-lg hover:scale-105 transition
      tooltip tooltip-bottom tooltip-info
      "
      data-tip="Edit"
                onClick={() =>
  setEditMaps((prev) => ({
    ...prev,
    email: !editMaps.email
  }))
}
    >
      <img
        src="/edit.png"
        className="w-5 h-5 object-contain"
      />
    </button> : null} 
       </div>
   </div>


     {showInputs ?  <div className='flex gap-2'>
       <button onClick={handleCancel} className='btn btn-active rounded-md hover:bg-gray-400 mt-20 btn-error' >CANCEL</button> 
      <button onClick={updateDetails} className="btn btn-active rounded-md hover:bg-gray-400 mt-20">DONE</button>
     </div> : <button onClick={() => setShowInputs(!showInputs)} className="btn btn-active rounded-md hover:bg-gray-400 mt-20">EDIT</button>}
     
     
  </div>
</div>
  
  )
}

export default Profile