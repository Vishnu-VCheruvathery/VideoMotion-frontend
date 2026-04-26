'use client';

import { loadAuthFromStorage } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
      const dispatch = useDispatch()

        useEffect(() => {
     
        dispatch(loadAuthFromStorage())
      
     }, [dispatch]);

     return children
}