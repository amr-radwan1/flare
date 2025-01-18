import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://34.139.77.174/api';

// Avatar Component
const Avatar = ({ letter, image, color }: { letter: string; image?: string; color?: string }) => (
  <View style={[styles.avatar, { backgroundColor: image ? 'transparent' : color || '#333' }]}>
    {image ? (
      <Image source={{ uri: image }} style={styles.avatarImage} />
    ) : (
      <Text style={styles.avatarText}>{letter}</Text>
    )}
  </View>
);

export default function DailyPrompt({ route }: { route: any }) {
  const { post_id } = route.params; // Get post_id from navigation route params
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Fetch replies when the component mounts
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setToken(userToken);

        const response = await fetch(`${API_BASE_URL}/posts/${post_id}/replies`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch replies');
        }

        const data = await response.json();
        setReplies(data);
      } catch (err) {
        setError(true);
        console.error(err);
        Alert.alert('Error', 'Failed to load replies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [post_id]);

  // Handle new reply submission
  const handleReplySubmit = async () => {
    if (!newReply.trim()) {
      Alert.alert('Error', 'Reply cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts/${post_id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ReplyText: newReply }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      const data = await response.json();
      setReplies((prevReplies) => [...prevReplies, data]);
      setNewReply('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.category}>🎵 Music</Text>

          <Text style={styles.question}>Who is the most overrated singer of all time?</Text>

          {/* Replies Section */}
          <View style={styles.replies}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : error ? (
              <Text style={styles.errorText}>Failed to load replies.</Text>
            ) : (
              replies.map((reply: any, index: number) => (
                <View key={index} style={[styles.reply, styles.replyCard]}>
                  <View style={styles.userInfo}>
                    <Avatar letter={reply.author.charAt(0).toUpperCase()} />
                    <Text style={styles.userText}>{reply.author} replied...</Text>
                  </View>
                  <Text style={styles.replyText}>{reply.ReplyText}</Text>
                </View>
              ))
            )}

            <Text style={styles.replyPrompt}>Reply to the discussion...</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your reply"
              placeholderTextColor="#666"
              value={newReply}
              onChangeText={setNewReply}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleReplySubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  category: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  question: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  replies: {
    paddingLeft: 16,
  },
  reply: {
    marginBottom: 16,
  },
  replyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  replyText: {
    color: '#333',
    fontSize: 14,
  },
  replyPrompt: {
    color: '#666',
    fontSize: 14,
    marginVertical: 8,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#222',
    borderRadius: 10,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
  },
});
