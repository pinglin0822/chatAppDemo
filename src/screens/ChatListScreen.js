import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hideNavigationBar } from 'react-native-navigation-bar-color';

// Sample data
const initialChats = [
  {
    id: '1',
    nickname: 'Ping Lin',
    avatar: require('../images/cpl.jpg'),
    lastMessage: 'Thank you',
    lastUpdated: new Date('2024-06-11T15:30:00'),
    unreadCount: 2,
    pinned: true,
  },
  {
    id: '2',
    nickname: 'Jason',
    avatar: require('../images/husky.jpg'),
    lastMessage: 'See you soon :smile:',
    lastUpdated: new Date('2024-06-12T09:00:00'),
    unreadCount: 0,
    pinned: false,
  },
  {
    id: '3',
    nickname: 'Group Chat 1',
    avatar: require('../images/default.png'),
    lastMessage: 'Hi guys',
    lastUpdated: new Date('2024-06-12T12:00:00'),
    unreadCount: 0,
    pinned: false,
  },
  {
    id: '4',
    nickname: 'Group Chat 2',
    avatar: require('../images/default.png'),
    lastMessage: 'Good morning!',
    lastUpdated: new Date('2024-06-12T08:00:00'),
    unreadCount: 0,
    pinned: false,
  },
];

const emojiMap = {
  ':smile:': '😄',
  ':wave:': '👋',
  ':heart:': '❤️',
  ':laugh:': '😂',
};

function parseEmoji(text) {
  return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}

export default function ChatListScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState(initialChats);

  const filteredChats = chats
    .filter(chat => chat.nickname.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastUpdated - a.lastUpdated;
    });

  const pinnedChats = filteredChats.filter(chat => chat.pinned);
  const otherChats = filteredChats.filter(chat => !chat.pinned);

  const handleLongPress = id => {
    const selectedChat = chats.find(chat => chat.id === id);
    const isPinned = selectedChat?.pinned;

    Alert.alert('Chat Options', 'Choose an action', [
      {
        text: isPinned ? 'Unpin' : 'Pin',
        onPress: () => {
          setChats(prev =>
            prev.map(chat =>
              chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
            )
          );
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Delete Conversation',
            'Are you sure you want to delete this conversation?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => setChats(prev => prev.filter(c => c.id !== id)),
              },
            ]
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  useEffect(() => {
    hideNavigationBar();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { userName: item.nickname })}
      onLongPress={() => handleLongPress(item.id)}
      style={styles.card}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <Text style={styles.time}>
            {item.lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }).replace(':', '.').toLowerCase()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message} numberOfLines={1}>
            {parseEmoji(item.lastMessage)}
          </Text>
          <View style={styles.badges}>
            {item.unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            ) : (
              <Ionicons
                name="checkmark-done"
                size={18}
                color="#6a5bc4"
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Hi, user!</Text>
        <Text style={styles.receivedText}>You Received</Text>
        <Text style={styles.messageCount}>
          {chats.reduce((sum, chat) => sum + chat.unreadCount, 0)} messages
        </Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Chat List */}
      <View style={{ flex: 1, backgroundColor:"#fff",paddingLeft:10,}}>
        {filteredChats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#aaa" />
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        ) : (
          <FlatList
            data={otherChats}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListHeaderComponent={
              <>
                {pinnedChats.length > 0 && (
                  <>
                    <Text style={styles.sectionHeader}>
                      Pinned Message ({pinnedChats.length})
                    </Text>
                    {pinnedChats.map(item => (
                      <View key={item.id}>{renderItem({ item })}</View>
                    ))}
                  </>
                )}
                <Text style={styles.sectionHeader}>
                  All Message ({otherChats.length})
                </Text>
              </>
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => Alert.alert('Add', 'Add group/contact')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6a5bc4' },
  greetingSection: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  greetingText: {
    fontWeight: 200,
    fontSize: 14,
    color: '#fff',
    paddingVertical: 10,
  },
  receivedText: {
    fontSize: 16,
    color: '#fff',
  },
  messageCount: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 20,
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
  sectionHeader: {
    fontSize: 16,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  info: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: { fontSize: 16, fontWeight: 'bold' },
  time: { fontSize: 12, color: '#666' },
  message: { fontSize: 14, color: '#444', maxWidth: '80%' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#aaa', marginTop: 10 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6a5bc4',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
