import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface User{
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    type: string;
    profile: string | null 
}

interface AuthState{
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    token: null,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            try {
                state.user = jwtDecode<User>(action.payload)
            } catch (error) {
                state.user = null;
                console.log('the error in auth: ', error)
            }
            localStorage.setItem('token', action.payload)
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
        },
        loadAuthFromStorage:(state) => {
            const savedToken = localStorage.getItem('token')
            if(savedToken){
                state.token = savedToken;
                try {
                    state.user = jwtDecode<User>(savedToken)
                } catch  {
                    state.user = null;
                }
            }
        },

        updateUserDetails: (state, action: PayloadAction<Partial<User>>) => {
  if (!state.user) return;

  state.user = {
    ...state.user,
    ...action.payload
  };
}

    }
})


export const { setToken, clearAuth, loadAuthFromStorage, updateUserDetails } = authSlice.actions;

export default authSlice.reducer;