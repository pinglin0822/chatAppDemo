// src/screens/ChatListScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const chats = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

export default function ChatListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', { userName: item.name })}
          >
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  chatItem: {
    padding: 15,
    backgroundColor: '#eaeaea',
    marginVertical: 5,
    borderRadius: 8,
  },
  chatName: { fontSize: 18 },
});
