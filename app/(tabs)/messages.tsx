import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Search, Plus } from 'lucide-react-native';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
      lastMessage: 'Thanks for walking Max today!',
      time: '2:30 PM',
      unread: 2,
      dogName: 'Max',
      dogBreed: 'Golden Retriever',
    },
    {
      id: '2',
      name: 'Robert Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      lastMessage: 'Can you walk Bella tomorrow at 5?',
      time: 'Yesterday',
      unread: 0,
      dogName: 'Bella',
      dogBreed: 'Poodle',
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      lastMessage: 'Charlie really enjoyed the walk!',
      time: 'Monday',
      unread: 0,
      dogName: 'Charlie',
      dogBreed: 'Beagle',
    },
    {
      id: '4',
      name: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      lastMessage: 'Let me know if you\'re available this weekend.',
      time: 'Sunday',
      unread: 0,
      dogName: 'Luna',
      dogBreed: 'Border Collie',
    },
  ];

  // Search filter function
  const filteredConversations = conversations.filter(
    conversation =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.dogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.dogBreed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
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
          <Text style={styles.dogInfo}>
            {item.dogName} ({item.dogBreed})
          </Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
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