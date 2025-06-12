// src/screens/ChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function ChatScreen({ route }) {
  const { userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: input }]);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chatting with {userName}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, marginBottom: 10 },
  messageList: { flex: 1 },
  message: { padding: 10, backgroundColor: '#d1f0d1', marginVertical: 4, borderRadius: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
});
