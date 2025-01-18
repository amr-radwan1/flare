import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Feather';

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

export default function DiscussionScreen({ route }: any) {
  const { post_id } = route.params; // Assume post_id is passed via navigation
  const [replies, setReplies] = useState([]); // State to store replies
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state

  useEffect(() => {
    // Fetch replies from the API
    const fetchReplies = async () => {
      try {
        const response = await fetch(`http://34.139.77.174/apiposts/${post_id}/replies`);
        if (!response.ok) {
          throw new Error('Failed to fetch replies');
        }
        const data = await response.json();
        setReplies(data); // Update state with fetched replies
      } catch (err) {
        setError(true); // Set error state if API fails
        Alert.alert('Error', 'Failed to load replies.');
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchReplies();
  }, [post_id]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.category}>🎵 Music</Text>

          <Text style={styles.question}>
            Who is the most overrated singer of all time?
          </Text>

          {/* Initial post */}
          <View style={styles.post}>
            <View style={styles.userInfo}>
              <Avatar letter="A" color="#FFD700" />
              <Text style={styles.userText}>alex smith says...</Text>
            </View>
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Taylor Swift</Text>
              <View style={styles.temperatureContainer}>
                <Icon name="thermometer" size={16} color="#FF4444" />
                <Text style={styles.temperature}>110</Text>
                <Icon name="fire" size={16} color="#FF4444" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>

          {/* Replies Section */}
          <View style={styles.replies}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : error ? (
              <Text style={styles.errorText}>Failed to load replies.</Text>
            ) : (
              replies.map((reply, index) => (
                <View key={index} style={[styles.reply, styles.replyCard]}>
                  <View style={styles.userInfo}>
                    <Avatar letter={reply.author.charAt(0).toUpperCase()} />
                    <Text style={styles.userText}>{reply.author} replied...</Text>
                  </View>
                  <Text style={styles.replyText}>{reply.content}</Text>
                  <View style={styles.replyIcons}>
                    <Icon name="check" size={16} color="#4CAF50" />
                  </View>
                </View>
              ))
            )}

            <Text style={styles.replyPrompt}>Reply to Alex Smith...</Text>
            <TextInput
              style={styles.input}
              placeholder="I think that"
              placeholderTextColor="#666"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Icon name="cloud" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="plus" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="user" size={24} color="#666" />
        </TouchableOpacity>
      </View>
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
  post: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  userText: {
    color: '#666',
    fontSize: 14,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  replyText: {
    color: '#333',
    fontSize: 14,
  },
  replyIcons: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  replyPrompt: {
    color: '#666',
    fontSize: 14,
    marginVertical: 8,
  },
  input: {
    color: '#666',
    fontSize: 14,
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 10,
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
  },
});
