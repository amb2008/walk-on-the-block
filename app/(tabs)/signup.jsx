import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { firebaseAuth, googleProvider } from "../../firebase.js";
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

export default function SignupScreen() {
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
        userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
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
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      await saveUserToFirestore(result.user, role);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Log In"}</Text>

      {isSignUp && (
        <View style={styles.roleContainer}>
          <Text style={styles.label}>I am a:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setRole("walker")}>
              <Text style={role === "walker" ? styles.radioSelected : styles.radioUnselected}>●</Text>
              <Text style={styles.radioText}>Walker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setRole("owner")}>
              <Text style={role === "owner" ? styles.radioSelected : styles.radioUnselected}>●</Text>
              <Text style={styles.radioText}>Owner</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.primaryButton} onPress={handleEmailAuth}>
        <Text style={styles.buttonText}>{isSignUp ? "Create Account" : "Log In"}</Text>
      </TouchableOpacity>

      <Text style={styles.toggleText}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <Text onPress={() => { setIsSignUp(!isSignUp); setError(""); }} style={styles.linkText}>
          {" "}{isSignUp ? "Log In" : "Sign Up"}
        </Text>
      </Text>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  roleContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    marginLeft: 6,
    fontSize: 16,
  },
  radioSelected: {
    fontSize: 18,
    color: "#4A80F0",
  },
  radioUnselected: {
    fontSize: 18,
    color: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  error: {
    color: "#FF5252",
    marginBottom: 12,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#4A80F0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: "#EA4335",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 8,
  },
  linkText: {
    color: "#4A80F0",
    fontWeight: "bold",
  },
  or: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#999",
  },
});
