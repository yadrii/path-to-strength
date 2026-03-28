import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const login = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken(); // 🔑 important
  return token;
};