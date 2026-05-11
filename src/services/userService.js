import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const DEFAULT_PROFILE_TYPES = ["basic_profile1", "basic_profile2"];

const getRandomDefaultProfileType = () => {
  return DEFAULT_PROFILE_TYPES[
    Math.floor(Math.random() * DEFAULT_PROFILE_TYPES.length)
  ];
};

export const ensureUserDocument = async (user) => {
  if (!user?.uid) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email || "",
      nickname: user.email ? user.email.split("@")[0] : "user",
      following: [],
      followers: [],
      profileImageUrl: "",
      defaultProfileType: getRandomDefaultProfileType(),
      createdAt: new Date(),
    });
    return;
  }

  const data = snap.data();
  const updates = {};

  if (!("nickname" in data)) {
    updates.nickname = user.email ? user.email.split("@")[0] : "user";
  }

  if (!("following" in data)) {
    updates.following = [];
  }

  if (!("followers" in data)) {
    updates.followers = [];
  }

  if (!("profileImageUrl" in data)) {
    updates.profileImageUrl = "";
  }

  if (!("defaultProfileType" in data)) {
    updates.defaultProfileType = getRandomDefaultProfileType();
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(userRef, updates);
  }
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return null;
  return { id: uid, ...snap.data() };
};

export const getUsersByIds = async (uids = []) => {
  if (!uids.length) return [];

  const results = await Promise.all(
    uids.map(async (uid) => {
      const userData = await getUserDocument(uid);
      return userData;
    })
  );

  return results.filter(Boolean);
};

export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};