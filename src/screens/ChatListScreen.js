import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hideNavigationBar } from 'react-native-navigation-bar-color';

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
    unreadCount: 1,
    pinned: false,
  },
  {
    id: '4',
    nickname: 'Group Chat 2',
    avatar: require('../images/default.png'),
    lastMessage: 'Good morning!',
    lastUpdated: new Date('2024-06-12T08:00:00'),
    unreadCount: 3,
    pinned: false,
  },
];

const contactList = [
  { id: 'c1', name: 'Ping Lin', avatar: require('../images/cpl.jpg') },
  { id: 'c2', name: 'Jason', avatar: require('../images/husky.jpg') },
  { id: 'c3', name: 'Lim', avatar: require('../images/image3.jpg') },
  { id: 'c4', name: 'Cathy', avatar: require('../images/image4.jpg') },
  { id: 'c5', name: 'Ali', avatar: require('../images/image5.jpg') },
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
  const [chats, setChats] = useState(initialChats);
  const [selectedTag, setSelectedTag] = useState('all');

  const filteredChats = chats
    .filter(chat => {
      if (selectedTag === 'direct') {
        return !chat.nickname.toLowerCase().includes('group');
      } else if (selectedTag === 'group') {
        return chat.nickname.toLowerCase().includes('group');
      }
      return true; // 'all'
    })
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
          Alert.alert('Delete Conversation', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () =>
                setChats(prev => prev.filter(c => c.id !== id)),
            },
          ]);
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
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        <Ionicons name="checkmark" size={12} color="#fff" style={styles.onlineDot} />
      </View>
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
      {/* Top right grid icon */}
      <TouchableOpacity
        style={styles.gridIcon}
        onPress={() => Alert.alert('Grid Icon', 'You tapped the grid icon')}
      >
        <Ionicons name="grid" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Hi, user!</Text>
        <Text style={styles.receivedText}>You Received</Text>
        <Text style={styles.messageCount}>
          {chats.reduce((sum, chat) => sum + chat.unreadCount, 0)} messages
        </Text>
      </View>

      <View style={styles.contactListSection}>
        <Text style={styles.contactListTitle}>Contact List</Text>
        <FlatList
          data={contactList}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View style={styles.contactAvatarContainer}>
                <Image source={item.avatar} style={styles.contactAvatar} />
                <Ionicons
                  name="checkmark"
                  size={12}
                  color="#fff"
                  style={styles.onlineDotSmall}
                />
              </View>
              <Text style={styles.contactName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.searchSection}>
        <Ionicons name="search" size={24} style={{ marginRight: 10 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tagsContainer}>
            {[
              { key: 'direct', label: `Directed Message (${chats.filter(c => !c.nickname.toLowerCase().includes('group')).length})` },
              { key: 'group', label: `Group (${chats.filter(c => c.nickname.toLowerCase().includes('group')).length})` },
              { key: 'all', label: `All (${chats.length})` },
            ].map(tag => (
              <TouchableOpacity
                key={tag.key}
                onPress={() => setSelectedTag(tag.key)}
                style={[
                  styles.tag,
                  selectedTag === tag.key && styles.activeTag,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTag === tag.key && styles.activeTagText,
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ flex: 1, backgroundColor: "#f0f0f0", paddingLeft: 10 }}>
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
  gridIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    right: 20,
    zIndex: 10,
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  greetingText: { fontWeight: '200', fontSize: 14, color: '#fff', paddingVertical: 10 },
  receivedText: { fontSize: 16, color: '#fff' },
  messageCount: { fontSize: 24, color: '#fff' },
  contactListTitle: { fontSize: 16, fontWeight: '200', color: '#fff', paddingBottom: 10 },
  contactListSection: { paddingVertical: 10, paddingLeft: 20, backgroundColor: '#6a5bc4' },
  contactItem: { alignItems: 'center', marginRight: 4, width: 64 },
  contactAvatarContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  contactAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ccc', marginBottom: 4 },
  contactName: { color: '#fff', fontSize: 12, textAlign: 'center' },

  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  tag: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  activeTag: {
    backgroundColor: '#f3f084',
  },
  activeTagText: {},
  sectionHeader: {
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: 'lightgreen',
    borderWidth: 1,
    borderColor: '#fff',
  },
  onlineDotSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: 'lightgreen',
    borderWidth: 1,
    borderColor: '#fff',
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
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
