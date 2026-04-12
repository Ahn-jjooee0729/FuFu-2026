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
    if (!myUid) {
        console.log("myUid 없음");
        return [];
    }

    const myRef = doc(db, "users", myUid);
    const snap = await getDoc(myRef);

    console.log("getFollowingIds - uid: ", myUid);
    console.log("getFollowingIds - exists: ", snap.exists());

    if (!snap.exists()) return [];

    const data = snap.data();
    console.log("getFollowingIds - user data: ", data);

    return data.following || [];
};