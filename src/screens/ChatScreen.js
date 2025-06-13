// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect  } from 'react';
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
import {hideNavigationBar,showNavigationBar} from 'react-native-navigation-bar-color';

export default function ChatScreen({ route, navigation }) {
  const { userName } = route.params;
  const [messages, setMessages] = useState([
  {
    id: '1',
    text: 'Hi! How are you?',
    type: 'text',
    status: 'sent',
    fromSelf: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    text: "I'm fine, thanks!",
    type: 'text',
    status: 'sent',
    fromSelf: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
  },
  {
    id: '3',
    text: "How about you?",
    type: 'text',
    status: 'sent',
    fromSelf: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
  },
  {
    id: '4',
    text: "I am fine too.",
    type: 'text',
    status: 'sent',
    fromSelf: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
  },
  {
    id: '5',
    text: "Thank you",
    type: 'text',
    status: 'sent',
    fromSelf: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
  },
]);

  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: input,
          type: 'text',
          status: 'sent',
          fromSelf: true,
          timestamp: new Date(),
        },
      ]);
      setInput('');
    }
  };

  useEffect(() => {
  if (flatListRef.current && messages.length > 0) {
    flatListRef.current.scrollToEnd({ animated: true });
  }
}, [messages]);

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

  useEffect(() => {
  hideNavigationBar();
}, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
          placeholderTextColor="#888" 
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
  alignItems: 'center',
  paddingVertical: 6,
  paddingHorizontal: 8,
  paddingBottom: 10,
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
  lineHeight: 20,
  backgroundColor: '#fff',
  marginHorizontal: 8,
  borderWidth: 1,
  borderColor: '#ddd',
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
    backgroundColor: '#fff',
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
