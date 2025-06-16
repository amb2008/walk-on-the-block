import React, { useState } from "react";
import { auth, googleProvider } from "../../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "expo-router";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import "../../styles/globals.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const db = getFirestore();

  const saveUserToFirestore = async (user, role) => {
    if (!role) return;
    const collectionName = role === "walker" ? "walkers" : "dogs";
    const userDoc = doc(db, collectionName, user.email);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      await setDoc(userDoc, {
        email: user.email,
        name: user.displayName || "User",
        image: user.photoURL || "https://via.placeholder.com/150",
      });
    }
  };

  const handleEmailAuth = async () => {
    try {
      setError("");
      if (isSignUp && !role) {
        setError("Please select whether you are a walker or an owner.");
        return;
      }
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      await saveUserToFirestore(userCredential.user, role);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      if (isSignUp && !role) {
        setError("Please select whether you are a walker or an owner.");
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user, role);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isSignUp ? "Sign Up" : "Log In"}</h2>

      {isSignUp && (
        <div className="auth-role-select">
          <label className="auth-label">I am a:</label>
          <div className="auth-role-options">
            <label className="auth-radio">
              <input
                type="radio"
                name="role"
                value="walker"
                checked={role === "walker"}
                onChange={() => setRole("walker")}
              />
              Walker
            </label>
            <label className="auth-radio">
              <input
                type="radio"
                name="role"
                value="owner"
                checked={role === "owner"}
                onChange={() => setRole("owner")}
              />
              Owner
            </label>
          </div>
        </div>
      )}

      <div className="auth-inputs">
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button className="auth-button primary" onClick={handleEmailAuth}>
        {isSignUp ? "Create Account" : "Log In"}
      </button>

      <p className="auth-toggle">
        {isSignUp ? "Already have an account?" : "Don't have an account?"} {" "}
        <button className="auth-link" onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
          {isSignUp ? "Log In" : "Sign Up"}
        </button>
      </p>

      <div className="auth-divider">
        <p className="auth-or">or</p>
        <button className="auth-button google" onClick={handleGoogleSignIn}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
