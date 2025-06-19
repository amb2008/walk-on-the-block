import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { CreditCard as Edit2, LogOut, Clock, DollarSign, Star, MapPin, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Pencil, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { db, signOutUser } from '../../firebase'; // Adjust the import path as necessary
import animationData from '../../assets/animations/dogAnimation.json'; // Adjust the import path as necessary
import { Platform } from 'react-native';
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"; // <-- Add this import
import useUserData from '/Users/c26ab1/Desktop/Coding/Web Apps + Games/Walk-On-The-Block/hooks/useUserData.js';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [editBio, setEditBio] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const animation = useRef(null);
  const [LottieView, setLottieView] = useState(null);

  const { 
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
  } = useUserData();

  useEffect(() => {
    if (userData) {
      setLoaded(true);
    }
  }, [userData]);

  async function handleBioBlur(){
    setEditBio(false);
    const userRef = doc(db, userType, userEmail);
    await setDoc(userRef, { bio: bio }, { merge: true })
    .then(() => { console.log("User bio updated successfully."); })
    .catch((error) => { console.error("Error updating user bio:", error); });
  };

  async function handleAddressBlur() {
    setEditAddress(false);
    const userRef = doc(db, userType, userEmail);
    await setDoc(userRef, { address: address }, { merge: true })
      .then(() => console.log("User address updated successfully."))
      .catch((error) => console.error("Error updating address:", error));
  }

  async function handleNameBlur() {
    const userRef = doc(db, userType, userEmail);
    await setDoc(userRef, { name: userName }, { merge: true })
      .then(() => console.log("User name updated successfully."))
      .catch((error) => console.error("Error updating user name:", error));
  }

  async function handleContactBlur() {
    setEditContact(false);
    const userRef = doc(db, userType, userEmail);
    await setDoc(userRef, { contact: contact }, { merge: true })
      .then(() => console.log("User contact updated successfully."))
      .catch((error) => console.error("Error updating contact:", error));
  }

  // const ownerData = {
  //   name: 'Sarah Williams',
  //   bio: 'Owner of Max, a friendly Golden Retriever who loves long walks and playing fetch.',
  //   photo: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
  //   location: 'Westfield, LA',
  //   dogs: [
  //     { 
  //       name: 'Max', 
  //       breed: 'Golden Retriever', 
  //       age: '3 years',
  //       photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'
  //     }
  //   ],
  //   stats: [
  //     { icon: <Clock size={18} color="#4A80F0" />, value: '18', label: 'Bookings' },
  //     { icon: <Star size={18} color="#4A80F0" />, value: '4.8', label: 'Rating' },
  //   ],
  // };

    // make sure to keep this at the end here
    useEffect(() => {
      // Dynamic import based on platform
      async function loadLottie() {
        if (Platform.OS === 'web') {
          const module = await import('lottie-react');
          setLottieView(() => module.default);
        } else {
          const module = await import('lottie-react-native');
          setLottieView(() => module.default);
        }
      }
      loadLottie();
    }, []);
  
  
    if (!LottieView) {
      return null; // or loading spinner
    }
  

   if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white"}}>
    <View style={styles.animationContainer}>
      {
        Platform.OS === 'web' ?
        <LottieView
          loop={true}
          animationData={animationData}
        />
        :
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'white',
        }}
        source={require('../../assets/animations/dogAnimation.json')}
      />
    }
    </View>
  </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A80F0', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {userData &&
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            
            <Image source={{ uri: userData.image }} style={styles.profileImage} />

            <TouchableOpacity style={styles.editButton}>
              <Edit2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {editName ?
          <TextInput
            style={styles.profileName}
            value={userName}
            onChangeText={(text) => setUserName(text)}
            onBlur={handleNameBlur}
            placeholder="Enter your name"
            placeholderTextColor="#FFFFFF"
            autoFocus></TextInput>
          :
          <Text style={styles.profileName} onPress={()=>setEditName(!editName)}>{userData.name || 'User'}</Text>
          }
          <Text style={styles.profileSchool}>{userType}</Text>
        </View>
        }
      </LinearGradient>

    {userData && (
      <ScrollView style={styles.content}>
        {/* {userData && (
        <View style={styles.statsContainer}>
        {userData.stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        )} */}

        <View style={styles.settingsContainer}> 
          <View style={styles.settingItem}>
          <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.settingItemLeft}>
              <TouchableOpacity style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]} onPress={() => setEditBio(!editBio)}>
                {editBio ? <Check size={18} color="#4A80F0" /> : <Pencil size={18} color="#4A80F0" />}
              </TouchableOpacity>
            </View>
          </View>
          {editBio ? (
              <TextInput
                style={styles.settingText}
                value={bio}
                onChangeText={(text) => setBio(text)}
                onBlur={handleBioBlur}
                placeholder="Edit your bio"
                placeholderTextColor="#8A8A8A"
                autoFocus
                multiline
              />
              ) : (
              <Text style={styles.settingText} onPress={()=>{setEditBio(true)}}>{bio || "Write your bio!"}</Text>
              )}

          {/* Address Section */}
          <View style={{ marginTop: 20 }}>
            <View style={styles.settingItem}>
              <Text style={styles.sectionTitle}>Address</Text>
              <View style={styles.settingItemLeft}>
                <TouchableOpacity style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]} onPress={() => 
                  {if (editAddress){
                    handleAddressBlur();
                  }
                  setEditAddress(!editAddress)}}>
                  {editAddress ? <Check size={18} color="#4A80F0" /> : <Pencil size={18} color="#4A80F0" />}
                </TouchableOpacity>
              </View>
            </View>
                  {editAddress ? (
                  <View>
                    {['street', 'apt', 'city', 'state', 'zip'].map((field) => (
                      <TextInput
                        key={field}
                        style={styles.TextInput}
                        value={address[field]}
                        onChangeText={(text) => setAddress((prev) => ({ ...prev, [field]: text }))}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        placeholderTextColor="#8A8A8A"
                      />
                    ))}
                  </View>
                  ) : (
                    <Text style={styles.settingText} onPress={() => setEditAddress(true)}>
                        {address?.street?.length > 1
                    ? `${address?.street || ''}, ${address?.apt?.length > 0 ? address?.apt + ', ' : ''}${address?.city || ''}, ${address?.state || ''}, ${address?.zip || ''}`.trim()
                    : 'Add your address'}   
                    </Text>
                  )}
          </View>
          {/* Contact Section */}
          <View style={{ marginTop: 20 }}>
            <View style={styles.settingItem}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <View style={styles.settingItemLeft}>
                <TouchableOpacity style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]} onPress={() => 
                  {if (editContact){
                    handleContactBlur();
                  }
                  setEditContact(!editContact)}}>
                  {editContact ? <Check size={18} color="#4A80F0" /> : <Pencil size={18} color="#4A80F0" />}
                </TouchableOpacity>
              </View>
            </View>
            {editContact ? (
              <TextInput
                style={styles.TextInput}
                value={contact}
                onChangeText={(text) => setContact(text)}
                onBlur={handleContactBlur}
                placeholder="Enter your contact info"
                placeholderTextColor="#8A8A8A"
                autoFocus
              />
            ) : (
              <Text style={styles.settingText} onPress={()=>{setEditContact(true)}}>{contact || "Add your contact info!"}</Text>
            )}
            </View>
        </View>

        {userType === 'owner' && userData && (
          <View style={styles.dogsContainer}>
            <Text style={styles.sectionTitle}>My Dogs</Text>
            {userData.dogs.map((dog, index) => (
              <View key={index} style={styles.dogCard}>
                <Image source={{ uri: dog.photo }} style={styles.dogImage} />
                <View style={styles.dogInfo}>
                  <Text style={styles.dogName}>{dog.name}</Text>
                  <Text style={styles.dogDetails}>{dog.breed}, {dog.age}</Text>
                </View>
                <TouchableOpacity style={styles.editDogButton}>
                  <Edit2 size={16} color="#4A80F0" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addDogButton}>
              <Text style={styles.addDogButtonText}>+ Add Another Dog</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
                <Bell size={18} color="#4A80F0" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4A80F0' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#E8F5E9' }]}>
                <Shield size={18} color="#50E3C2" />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
            </View>
            <ChevronRight size={18} color="#8A8A8A" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
                <HelpCircle size={18} color="#4A80F0" />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={18} color="#8A8A8A" />
          </TouchableOpacity>
        </View>
      
        <TouchableOpacity style={styles.logoutButton} onPress={()=>signOutUser()}>
          <LogOut size={18} color="#FF5252" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A80F0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  profileSchool: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  bioContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
  },
  dogsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dogImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  dogInfo: {
    flex: 1,
    marginLeft: 15,
  },
  dogName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  dogDetails: {
    fontSize: 14,
    color: '#666666',
  },
  editDogButton: {
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addDogButton: {
    borderWidth: 1,
    borderColor: '#4A80F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addDogButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 14,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#333333',
  },
  toggleButton: {
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#333333',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  logoutText: {
    color: '#FF5252',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  TextInput: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333333',
    marginTop: 10,
  },
});