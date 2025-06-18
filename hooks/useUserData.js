import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { CreditCard as Edit2, LogOut, Clock, DollarSign, Star, MapPin, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Pencil, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { db, signOutUser } from '../firebase'; // Adjust the import path as necessary

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"; 
export default function useUserData() {
  const [userEmail, setUserEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [userWalks, setUserWalks] = useState(0);
    const [userEarned, setUserEarned] = useState(0);
    const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
    const [bio, setBio] = useState('Please write your bio!');
    const [contact, setContact] = useState('Please add your contact info!');

  // Detect auth state
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          setUserEmail(user.email);
        } else {
          setUserEmail(null);
          setUserType(null);
          setUserData(null);
        }
      });
      return unsubscribe;
    }, [])
  );

  // Determine user type
  useEffect(() => {
    if (!userEmail) return;

    const checkUserType = async () => {
      try {
        const walkerQuery = query(collection(db, 'walkers'), where('email', '==', userEmail));
        const walkerSnapshot = await getDocs(walkerQuery);

        if (!walkerSnapshot.empty) {
          setUserType('walkers');
          return;
        }

        const dogQuery = query(collection(db, 'dogs'), where('email', '==', userEmail));
        const dogSnapshot = await getDocs(dogQuery);

        if (!dogSnapshot.empty) {
          setUserType('dogs');
        }
      } catch (error) {
        console.error('Error determining user type:', error);
      }
    };

    checkUserType();
  }, [userEmail]);

  const fetchUser = async () => {
    if (!userEmail || !userType) return;

    try {
    const userDoc = await getDoc(doc(db, userType, userEmail));
    if (userDoc.exists()) {
        const data = userDoc.data();
        const finalUserData = {
        name: data.name || 'User',
        image: data.image || 'https://via.placeholder.com/150',
        bio: data.bio || 'Please write your bio!',
        email: data.email || userEmail,
        address: data.address || 'Please add your address',
        contact: data.contact || 'Please add your contact info',
        stats: [
            { icon: <Clock size={18} color="#4A80F0" />, value: data.walks || 0, label: 'Walks' },
            { icon: <DollarSign size={18} color="#4A80F0" />, value: data.earned || 0, label: 'Earned' },
            { icon: <Star size={18} color="#4A80F0" />, value: data.rating || 0, label: 'Rating' },
        ],
        };
        setUserData(finalUserData);
        setUserName(data.name || 'User');
        setUserImage(data.image || 'https://via.placeholder.com/150');
        setUserRating(data.rating || 0);
        setUserWalks(data.walks || 0);
        setUserEarned(data.earned || 0);
        setBio(data.bio || 'Please write your bio!');
        setContact(data.contact || 'Please add your contact info!');
        setAddress({
            street: data.address?.street || '',
            apt: data.address?.apt || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zip: data.address?.zip || '',
        });
    } else {
        console.log('No such user document.');
    }
    } catch (error) {
    console.error('Error fetching user data:', error);
    }
};

  // Fetch full user data
  useEffect(() => {
    fetchUser();
  }, [userType, userEmail]);

  const refreshUserData = async () => {
    if (!userEmail || !userType) return;
    await fetchUser(userEmail, userType);
  };

  return {
    userData,
    userEmail,
    userType,
    userName,
    userImage,
    userRating,
    userWalks,
    userEarned,
    address,
    bio,
    contact,
    setAddress,
    setUserData,
    setUserName,
    setBio,
    setContact,
    refreshUserData
//   return { userData, setUserData, userEmail, userType, userName, userImage, userRating, userWalks, userEarned, setUserType, setUserEmail, setUserName, setUserImage, setUserRating, setUserWalks, setUserEarned, signOutUser };
}}