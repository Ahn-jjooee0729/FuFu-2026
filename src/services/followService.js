import {db} from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

export const followUser = async (myUid, targetUid) => {
    if(!myUid || !targetUid || myUid === targetUid) return;

    const myRef = doc(db, "users", myUid);
    const targetRef = doc(db, "users", targetUid);

    await updateDoc(myRef, {
        following: arrayUnion(targetUid),
    });
    await updateDoc(targetRef, {
        followers: arrayUnion(myUid),
    });
};

export const unfollowUser = async (myUid, targetUid)=> {
    if (!myUid || !targetUid || myUid === targetUid) return;

    const myRef = doc(db, "users", myUid);
    const targetRef = doc(db, "users", targetUid);

    await updateDoc(myRef, {
        following: arrayRemove(targetUid),
    });

    await updateDoc(targetRef, {
        followers: arrayRemove(myUid),
    });
};

export const getFollowingIds = async (myUid) =>{
    if (!myUid) return [];

    const myRef = doc(db, "users", myUid);
    const snap = await getDoc(myRef);

    if (!snap.exists()) return [];

    return snap.data.following || [];
};