import React, { useState } from 'react';
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
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';


// Sample data
const initialChats = [
  {
    id: '1',
    nickname: 'Ping Lin',
    avatar: require('../images/cpl.jpg'),
    lastMessage: 'Hello there :wave:',
    lastUpdated: new Date('2024-06-11T15:30:00'),
    unreadCount: 2,
    pinned: true,
  },
  {
    id: '2',
    nickname: 'Bob',
    avatar: require('../images/husky.jpg'),
    lastMessage: 'See you soon :smile:',
    lastUpdated: new Date('2024-06-12T09:00:00'),
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

  const handleLongPress = id => {
    Alert.alert('Delete Conversation', 'Are you sure you want to delete this conversation?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setChats(prev => prev.filter(c => c.id !== id)),
      },
    ]);
  };

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
            {item.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message} numberOfLines={1}>
            {parseEmoji(item.lastMessage)}
          </Text>
          <View style={styles.badges}>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
            {item.pinned && <Octicons name="pin" size={14} color="gray" />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity onPress={() => Alert.alert('Add', 'Add group/contact')}>
          <Text style={{ fontSize: 28 }}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search..."
        placeholderTextColor="#888"     // Light grey placeholder
        value={search}
        onChangeText={setSearch}
      />

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={40} color="#aaa" />
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  searchBox: {
    backgroundColor: '#fff',          // White background
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',              // Light border for definition
    color: '#000',                    // Black input text
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',  // Light grey border
    backgroundColor: '#fff',    // Flat white to match the new design
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
});
