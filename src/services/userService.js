import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const ensureUserDocument = async (user) => {
    if(!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if(!snap.exists()){
        await setDoc(userRef, {
            email: user.email || "",
            nickname: user.email ? user.email.split("@")[0] : "user",
            following: [],
            followers:[],
            createdAt: new Date(),
        });
        return;
    }

    const data = snap.data();
    const updates = {};

    if (!("nickname" in data)){
        updates.nickname = user.email ? user.email.split("@")[0] :"user";
    }
    if (!("following" in data)) {
        updates.following = [];
    }
    if (!("followers" in data)) {
        updates.followers = [];
    }

    if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
    }
};

export const getUserDocument = async (uid) => {
    if(!uid) return null;

    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if(!snap.exists()) return null;
    return snap.data();
};