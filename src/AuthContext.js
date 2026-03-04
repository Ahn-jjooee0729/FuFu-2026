import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "./firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); //처음 앱을 결 때 판별 중

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); //로그인 상태면 user, 아니면 null
            setLoading(false); //판뱔 끝
        });

        return () => unsubscribe();

    }, []);

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext (AuthContext);
}