import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { pushSignIn } from '../../hooks/pushSignIn.js'; 

export default function ScheduleScreen() {
  pushSignIn();
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedFilter, setSelectedFilter] = useState('Upcoming');

  // Mock data
  const upcomingWalks = [
    {
      id: '1',
      dogName: 'Max',
      ownerName: 'Sarah Johnson',
      date: 'Today',
      time: '3:00 PM - 4:00 PM',
      location: '123 Maple Street',
      distance: '0.5 miles',
      image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      confirmed: true,
    },
    {
      id: '2',
      dogName: 'Bella',
      ownerName: 'Robert Smith',
      date: 'Tomorrow',
      time: '5:30 PM - 6:30 PM',
      location: '456 Oak Avenue',
      distance: '0.7 miles',
      image: 'https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg',
      confirmed: false,
    },
  ];

  const completedWalks = [
    {
      id: '3',
      dogName: 'Charlie',
      ownerName: 'Emily Davis',
      date: 'Yesterday',
      time: '4:00 PM - 5:00 PM',
      location: '789 Pine Road',
      distance: '1.2 miles',
      image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      earnings: '$15',
      rating: 5,
    },
    {
      id: '4',
      dogName: 'Luna',
      ownerName: 'James Wilson',
      date: 'Mon, 4 April',
      time: '2:30 PM - 3:30 PM',
      location: '101 Cedar Lane',
      distance: '0.9 miles',
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      earnings: '$12',
      rating: 4,
    },
  ];

  const dates = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const filters = ['Upcoming', 'Completed', 'Requests'];

  const getDisplayWalks = () => {
    switch (selectedFilter) {
      case 'Upcoming':
        return upcomingWalks;
      case 'Completed':
        return completedWalks;
      case 'Requests':
        return []; // No requests in mock data
      default:
        return upcomingWalks;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View>

      {/* Date slider */}
      <View style={styles.dateSlider}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateButton,
                selectedDate === date && styles.selectedDateButton,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === date && styles.selectedDateText,
                ]}
              >
                {date}
              </Text>
              {date === 'Today' && (
                <View style={styles.todayIndicator}>
                  <Text style={styles.todayDot}>•</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Schedule list */}
      <ScrollView style={styles.scheduleList}>
        {getDisplayWalks().length > 0 ? (
          getDisplayWalks().map((walk) => (
            <View key={walk.id} style={styles.walkCard}>
              <Image source={{ uri: walk.image }} style={styles.dogImage} />
              <View style={styles.walkInfo}>
                <View style={styles.walkHeader}>
                  <View>
                    <Text style={styles.dogName}>{walk.dogName}</Text>
                    <Text style={styles.ownerName}>{walk.ownerName}</Text>
                  </View>
                  {selectedFilter === 'Completed' ? (
                    <View style={styles.earnings}>
                      <Text style={styles.earningsText}>{walk.earnings}</Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.statusBadge,
                        walk.confirmed
                          ? styles.confirmedBadge
                          : styles.pendingBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          walk.confirmed
                            ? styles.confirmedText
                            : styles.pendingText,
                        ]}
                      >
                        {walk.confirmed ? 'Confirmed' : 'Pending'}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.walkDetailsContainer}>
                  <View style={styles.walkDetail}>
                    <Calendar size={14} color="#4A80F0" />
                    <Text style={styles.walkDetailText}>{walk.date}</Text>
                  </View>
                  <View style={styles.walkDetail}>
                    <Clock size={14} color="#4A80F0" />
                    <Text style={styles.walkDetailText}>{walk.time}</Text>
                  </View>
                  <View style={styles.walkDetail}>
                    <MapPin size={14} color="#4A80F0" />
                    <Text style={styles.walkDetailText}>
                      {walk.location} ({walk.distance})
                    </Text>
                  </View>
                </View>

                {selectedFilter === 'Completed' ? (
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.ratingStar,
                          i < walk.rating && styles.filledStar,
                        ]}
                      >
                        ★
                      </Text>
                    ))}
                  </View>
                ) : (
                  <View style={styles.actionButtons}>
                    {!walk.confirmed && (
                      <TouchableOpacity style={styles.declineButton}>
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        walk.confirmed
                          ? styles.directionsButton
                          : styles.confirmButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          walk.confirmed
                            ? styles.directionsButtonText
                            : styles.confirmButtonText,
                        ]}
                      >
                        {walk.confirmed ? 'Get Directions' : 'Confirm'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {selectedFilter.toLowerCase()} walks found
            </Text>
            {selectedFilter === 'Upcoming' && (
              <TouchableOpacity style={styles.findButton}>
                <Text style={styles.findButtonText}>Find Dogs to Walk</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
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
  dateSlider: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    borderRadius: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
  },
  selectedDateButton: {
    backgroundColor: '#4A80F0',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  todayIndicator: {
    marginTop: -5,
  },
  todayDot: {
    color: '#FF9557',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F4F6F8',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedFilterButton: {
    backgroundColor: '#4A80F0',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
  scheduleList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  walkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dogImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  walkInfo: {
    flex: 1,
    marginLeft: 15,
  },
  walkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dogName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  ownerName: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confirmedText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9557',
  },
  walkDetailsContainer: {
    marginBottom: 12,
  },
  walkDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  walkDetailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4A80F0',
    flex: 1,
  },
  directionsButton: {
    backgroundColor: '#4A80F0',
    flex: 1,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  directionsButtonText: {
    color: '#FFFFFF',
  },
  declineButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    marginRight: 10,
    flex: 1,
  },
  declineButtonText: {
    color: '#FF5252',
    fontWeight: '600',
    fontSize: 14,
  },
  earnings: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earningsText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingStar: {
    fontSize: 18,
    color: '#E0E0E0',
    marginRight: 2,
  },
  filledStar: {
    color: '#FFD700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#8A8A8A',
    marginBottom: 20,
  },
  findButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  findButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});