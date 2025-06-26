import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore"; // <-- Add this import
import { Search, ArrowLeftIcon} from 'lucide-react-native';
import { pushSignIn } from '../../hooks/pushSignIn.js'; 
import useUserData from '../../hooks/useUserData.js';
import { db } from '../../firebase.js'; // Adjust the import path as necessary
import animationData from '../../assets/animations/dogAnimation.json'; // Adjust the import path as necessary

export default function MessagesScreen() {
  pushSignIn();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [LottieView, setLottieView] = useState(null);
  const [showChat, setShowChat] = useState(false)
  const [currentChat, setCurrentChat] = useState(null) 
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(null);

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
    userSignedIn,
    chats,
    setAddress,
    setUserData,
    setUserName,
    setBio,
    setContact,
    refreshUserData
  } = useUserData();

  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [])
  );

  async function fetchChats() {
    setConversations([]);
    chats.forEach(async chat => {
      const chatDoc = await getDoc(doc(db, "chats", chat));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const id = chat;
        console.log(chatData, userEmail)
        const name = chatData.display[userEmail].name
        const image = chatData.display[userEmail].image;
        const lastMessage = chatData.lastMessage || '';
        setConversations(prevConversations => [
          ...prevConversations, {id: id, name: name, image: image, messages: [chatData.messages], lastMessage: lastMessage }
        ]);
        console.log(chatData);
      }
      setLoaded(true);
   })
  }

  useEffect(() => {
    fetchChats();
  }, [chats]);
  
  useEffect(() => {
    console.log('Conversations:', conversations);
  }, [conversations]);

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

  function toggleChat(item){
    setShowChat(true)
    setCurrentChat(item)
    setMessages(item.messages[0])
  }

  // send message function
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      text: newMessage,
      sender: userEmail,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setNewMessage('');

    await setDoc(doc(db, "chats", currentChat.id), {
      messages: updatedMessages,
      lastMessage: newMsg.text,
    }, { merge: true });
  };

  // update messages whenever another is sent
  useEffect(() => {
    if (currentChat){
      console.log(currentChat)
      const refreshMessages = onSnapshot(doc(db, "chats", currentChat.id), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessages(data.messages || []);
        }
      });

      return () => refreshMessages(); // Clean up the listener on unmount
    }
  }, [currentChat]);
  

  // Search filter function
  const filteredConversations = conversations.filter(
    conversation =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.dogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.dogBreed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity style={styles.conversationItem} onPress={()=>{toggleChat(item)}}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <View style={styles.messagePreviewContainer}>
          <Text 
            style={[
              styles.messagePreview, 
              item.unread > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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

if (showChat){
  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={0} // adjust to match your header/nav height
  >
    <TouchableWithoutFeedback onPress={()=>{Platform.OS === 'ios' && Keyboard.dismiss}} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{currentChat.name}</Text>
          <TouchableOpacity onPress={()=>setShowChat(false)}>
            <ArrowLeftIcon size={30} color={"blue"}/>
          </TouchableOpacity>
        </View>
        {/* <View style={{ padding: 20, paddingTop: 60,  backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E0E0E0', display: "flex", flexDirection: "row", justifyContent: "space-between"}}> */}
        {/* </View> */}

        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={{
              alignSelf: item.sender === userEmail ? 'flex-end' : 'flex-start',
              backgroundColor: item.sender === userEmail ? '#4A80F0' : '#E0E0E0',
              borderRadius: 12,
              padding: 10,
              marginBottom: 10,
              maxWidth: '70%',
            }}>
              <Text style={{
                color: item.sender === userEmail ? 'white' : '#333',
                fontSize: 14,
              }}>{item.text}</Text>
            </View>
          )}
        />

        <View style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderColor: '#E0E0E0',
          alignItems: 'center',
        }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#F1F1F1',
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: Platform.OS === 'ios' ? 12 : 10,
              fontSize: 14,
              marginRight: 10,
            }}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: '#4A80F0',
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

}


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8A8A8A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#8A8A8A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.conversationList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No messages match your search' : 'No messages yet'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start a Conversation</Text>
            </TouchableOpacity>
          )}
        </View>
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
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  newMessageButton: {
    backgroundColor: '#4A80F0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333333',
  },
  conversationList: {
    paddingHorizontal: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  conversationTime: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  messagePreviewContainer: {
    flex: 1,
  },
  dogInfo: {
    fontSize: 13,
    color: '#4A80F0',
    fontWeight: '500',
    marginBottom: 3,
  },
  messagePreview: {
    fontSize: 14,
    color: '#666666',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333333',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8A8A8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});