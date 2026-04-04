import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useFootprints({ userId } = {}) {
    const [footprints, setFootprints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ref = collection(db, "footprints");

        const q = userId 
            ? query(ref, where("userId", "==", userId), orderBy("createdAt", "desc"))
            : query(ref, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFootprints(data);
            setLoading(false);

        });

        return () => unsubscribe();
    }, [userId]);

    return { footprints, loading };
}