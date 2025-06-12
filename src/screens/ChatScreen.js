// src/screens/ChatScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen({ route, navigation }) {
  const { userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [
        {
          id: Date.now().toString(),
          text: input,
          type: 'text',
          status: 'sent',
          fromSelf: true,
          timestamp: new Date(),
        },
        ...prev,
      ]);
      setInput('');
    }
  };

  const handleLongPress = (message) => {
    Alert.alert('Message Options', 'Choose an action', [
      { text: 'Copy', onPress: () => {} },
      { text: 'Delete', onPress: () => deleteMessage(message.id), style: 'destructive' },
      { text: 'Recall', onPress: () => {} },
      { text: 'Forward', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      style={[styles.messageBubble, item.fromSelf ? styles.self : styles.other]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
    </TouchableOpacity>
  );

  const formatTime = (date) => {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{userName}</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={20} />
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingTop: 10 }}
      />

      {/* Input Area */}
      <View style={styles.inputBar}>
        <TouchableOpacity>
          <Icon name="happy-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          multiline
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={24} color="#2e7d32" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  navBar: {
    height: 100,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    fontSize: 15,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 8,
  },
  icon: {
    color: '#666',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 10,
  },
  self: {
    backgroundColor: '#d1f0d1',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
});
