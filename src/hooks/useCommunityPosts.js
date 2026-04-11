import { useEffect, useState } from "react";
import{ collection, onSnapshot, orderBy, query, where, } from "firebase/firestore";
import {db} from "../firebase";

export function useCommunityPosts({category} = {}){
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ref = collection(db, "communityPosts");

        const q = category
            ? query(
                ref,
                where("category", "==", category),
                orderBy("createdAt", "desc") 
            )
            : query(ref, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }));

            setPosts(data);
            setLoading(false);
        });

        return () => unsubscribe();
        
    }, [category]);

    return {posts, loading};
}