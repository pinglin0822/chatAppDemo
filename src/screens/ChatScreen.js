// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
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
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';

export default function ChatScreen({ route, navigation }) {
  const { userName } = route.params;
  const [messages, setMessages] = useState([
    {
      id: '5',
      text: "Thank you",
      fromSelf: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: '4',
      text: "I am fine too.",
      fromSelf: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: '3',
      text: "How about you?",
      fromSelf: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: '2',
      text: "I'm fine, thanks!",
      fromSelf: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: '1',
      text: "Hi! How are you?",
      fromSelf: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);

  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  const userAvatar = require('../images/cpl.jpg');


  const sendMessage = () => {
    if (input.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        text: input,
        fromSelf: true,
        timestamp: new Date(),
      };
      setMessages(prev => [newMsg, ...prev]); // prepend
      setInput('');
    }
  };


  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const handleLongPress = (message) => {
    Alert.alert('Message Options', 'Choose an action', [
      { text: 'Copy', onPress: () => { } },
      { text: 'Delete', onPress: () => deleteMessage(message.id), style: 'destructive' },
      { text: 'Recall', onPress: () => { } },
      { text: 'Forward', onPress: () => { } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const renderMessage = ({ item }) => {
    if (item.fromSelf) {
      return (
        <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            style={[styles.messageBubble, styles.self]}
          >
            <Text style={[styles.messageText, { color: '#fff' }]}>{item.text}</Text>
          </TouchableOpacity>
          <Text style={[styles.timestamp, { textAlign: 'right', marginRight: 6 }]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.otherMessageContainer}>
          <View style={styles.avatarContainer}>
            <Image source={userAvatar} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              style={[styles.messageBubble, styles.other]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </TouchableOpacity>
            <Text style={[styles.timestamp, { marginLeft: 6 }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      );
    }
  };





  const formatTime = (date) => {
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12

    return `${hours}:${minutes} ${ampm}`;
  };
  useEffect(() => {
    hideNavigationBar();
  }, []);

  return (
    <View
      style={styles.container}
    >
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft:10}}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>{userName}</Text>
          <Text style={styles.onlineStatus}>
            <Text style={{ color: 'lightgreen' }}>●</Text> Online
          </Text>
        </View>
        <TouchableOpacity style={{marginRight:10}}>
          <Icon name="ellipsis-horizontal" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.chatArea}>
        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 90 }}
        />

        {/* Input Area */}
        <View style={styles.inputBar}>
          <TouchableOpacity>
            <Icon name="add" size={28} style={styles.plusIcon} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type Message"
              placeholderTextColor="#888"
              multiline
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Icon name="happy-outline" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a5bc4',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: -10,
  },
  navBar: {
    height: 120,
    backgroundColor: '#6a5bc4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#6a5bc4',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navTitleContainer: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    color: '#fff',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#fff', // this will apply to "Online"
    marginTop: 2,
  },
  inputBar: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 6,
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderTopColor: '#ddd',
},
plusIcon: {
  color: '#6a5bc4',
  marginHorizontal: 6,
},

  input: {
  flex: 1,
  fontSize: 15,
  paddingVertical: 4, 
  color: '#000',
},
  inputWrapper: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 8,
  minHeight: 50,  
},
emojiButton: {
  paddingLeft: 8,
},
sendButton: {
  marginLeft: 8,
  backgroundColor: '#6a5bc4',
  padding: 10,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
  icon: {
    color: '#666',
  },
  otherMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    marginLeft: 10,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  avatarContainer: {
    position: 'relative',
  },

  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: '#f0f0f0', // match chat background
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 10,
  },
  self: {
    backgroundColor: '#6a5bc4',
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
