import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types/navigation';
import Navbar from './Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font'; // Import expo-font

const categories = [
  { id: 'sports', label: 'sports', icon: '🏈' },
  { id: 'music', label: 'music', icon: '🎵' },
  { id: 'movies', label: 'movies', icon: '🎬' },
  { id: 'food', label: 'food', icon: '🍽' },
  { id: 'fashion', label: 'fashion', icon: '🧥' },
  { id: 'tech', label: 'tech', icon: '📱' },
  { id: 'travel', label: 'travel', icon: '🌍' },
  { id: 'politics', label: 'politics', icon: '⚖️' },
  { id: 'health', label: 'health', icon: '🩺' },
  { id: 'fitness', label: 'fitness', icon: '🏋️‍♂️' },
];

interface Prompt {
  PromptID: number;
  PromptText: string;
  Category: string;
}

interface User {
  UserID: number;
  Username: string;
  ProfilePicture: string;
}

interface Post {
  PostID: number;
  UserID: number;
  PromptID: number;
  PostText: string;
  UpvoteCount: number;
}

interface Reply {
  ReplyID: number;
  UserID: number;
  PostID: number;
  Username: string;
  ProfilePicture: string;
  ReplyText: string;
}

type RepliesScreenRouteProp = RouteProp<RootStackParamList, 'Replies'>;

export default function Replies() {
  const route = useRoute<RepliesScreenRouteProp>();
  const { postId, promptId } = route?.params ?? { postId: 0, promptId: 0 };
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [originalPoster, setOriginalPoster] = useState<User | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Libre Baskerville': require('../assets/fonts/LibreBaskerville-Bold.ttf'),
        // You can add more fonts if needed
      });
    }
    loadFonts();
    fetchData();
  }, [postId, promptId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const repliesResponse = await fetch(`http://34.139.77.174/api/posts/${postId}/replies`);
      const promptResponse = await fetch(`http://34.139.77.174/api/prompt/${promptId}`);
      const postResponse = await fetch(`http://34.139.77.174/api/posts/${postId}`);

      if (!repliesResponse.ok || !promptResponse.ok || !postResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const repliesData = (await repliesResponse.json()).replies;
      const promptData = await promptResponse.json();
      const postData = await postResponse.json();
      const originalPosterResponse = await fetch(`http://34.139.77.174/api/user/${postData.UserID}`);

      if (!originalPosterResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const originalPosterData = await originalPosterResponse.json();
      const repliesWithUserInfo = await Promise.all(
        repliesData.map(async (reply: Reply) => {
          const userResponse = await fetch(`http://34.139.77.174/api/user/${reply.UserID}`);
          const userData = await userResponse.json();
          return { ...reply, Username: userData.Username, ProfilePicture: userData.ProfilePicture };
        })
      );

      setPrompt(promptData);
      setPost(postData);
      setOriginalPoster(originalPosterData);
      setReplies(repliesWithUserInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      const userId = await AsyncStorage.getItem('UserID');
      if (!userId) throw new Error('UserID not found');

      const response = await fetch(`http://34.139.77.174/api/posts/${postId}/replies/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserID: parseInt(userId), ReplyText: replyText }),
      });

      if (!response.ok) throw new Error('Failed to submit reply');

      const newReply = await response.json();
      const userResponse = await fetch(`http://34.139.77.174/api/user/${userId}`);
      const userData = await userResponse.json();

      setReplies((prevReplies) => [
        ...prevReplies,
        {
          ReplyID: newReply.ReplyID,
          UserID: parseInt(userId),
          PostID: postId,
          Username: userData.Username,
          ProfilePicture: userData.ProfilePicture || 'https://via.placeholder.com/30',
          ReplyText: replyText,
        },
      ]);
      setReplyText('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const category = prompt?.Category;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <View style={styles.outsideContainer}>
        <View style={styles.container}>

          <Text style={styles.subtitle}>{prompt?.PromptText}</Text>


          {/* Category */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {categories.find(c => c.id === category)?.icon} {categories.find(c => c.id === category)?.label}
            </Text>
          </View>

          {originalPoster && post && (
            <View style={[styles.postSection, styles.centerAlign]}>
              <View style={styles.posterInfo}>
                <Image
                  source={require('../assets/images/default_pfp.png')}
                  style={styles.avatar}
                />
                <Text style={styles.usernameText}>
                  {originalPoster.Username || 'Anonymous'} says...
                </Text>
              </View>
              <Text style={styles.postText}>{post.PostText}</Text>
              <Text style={styles.voteCount}>{post.UpvoteCount || 0}</Text>
            </View>
          )}

          {replies.map((reply) => (
            <View key={reply.ReplyID} style={styles.replySection}>
              <Text style={styles.username}>{reply.Username} replied...</Text>
              <Text style={styles.replyText}>{reply.ReplyText}</Text>
            </View>
          ))}

          <View style={styles.replyInputSection}>
            <TextInput
              style={styles.replyInput}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Type your reply..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleReplySubmit}>
              <Text style={styles.submitButtonText}>Submit Reply</Text>
            </TouchableOpacity>
          </View>

        </View>


        <Navbar activeNav="Trending" />
      </View>

    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  promptSection: { padding: 16 },
  promptText: { fontSize: 20, fontWeight: 'bold', color: '#000', fontFamily: 'Libre Baskerville' },
  categoryTag: { fontSize: 14, color: '#666', marginTop: 4 },
  postSection: {
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center', // Center the entire section on the screen
    fontFamily: 'Libre Baskerville',
  }, username: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  replySection: { padding: 16, borderTopWidth: 1, borderColor: '#ccc' },
  replyText: { fontSize: 14, color: '#333', marginTop: 4 },
  replyInputSection: { padding: 16 },
  replyInput: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, color: '#000' },
  submitButton: { marginTop: 16, backgroundColor: '#007BFF', padding: 12, borderRadius: 8 },
  submitButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  categoryText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Libre Baskerville',
  },
  centerAlign: {
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically if needed
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Libre Baskerville'
  },
  postText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center', // Center-align the post text
    marginVertical: 10,
    fontFamily: 'Libre Baskerville'
  },
  voteCount: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 8,
  },
  posterInfo: {
    flexDirection: 'row', // Align avatar and username side-by-side
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  container: {
    backgroundColor: '#fff',
    paddingTop: 60,
    flex: 1, // Takes up the remaining space, pushing the navbar down
  },
  loadingContainer: {
    flex: 1, // Occupies the entire screen
    justifyContent: 'center', // Centers the loader vertically
    // alignItems: 'center', // Centers the loader horizontally
    // backgroundColor: '#222', // Optional background color
  },
  outsideContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'Libre Baskerville',
    textAlign: 'center',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxHeight: 60,
    elevation: 3,

  },
});
