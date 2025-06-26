import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function pushSignIn() {
    const router = useRouter();
    const auth = getAuth();


  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
    } else {
      router.push('/signup');
    }
  });
}