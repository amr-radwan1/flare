import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types/navigation';
import Navbar from './Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RepliesScreenRouteProp = RouteProp<RootStackParamList, 'Replies'>;

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
    fetchData();
  }, [postId, promptId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
  
      // Fetch replies
      const repliesResponse = await fetch(`http://34.139.77.174/api/posts/${postId}/replies`);
      if (!repliesResponse.ok) {
        throw new Error(`Failed to fetch replies: ${repliesResponse.status}`);
      }
      const repliesData = (await repliesResponse.json()).replies;
  
      // Fetch prompt details
      const promptResponse = await fetch(`http://34.139.77.174/api/prompt/${promptId}`);
      if (!promptResponse.ok) {
        throw new Error(`Failed to fetch prompt: ${promptResponse.status}`);
      }
      const promptData = await promptResponse.json();
      setPrompt(promptData);
  
      // Fetch the post details
      const postResponse = await fetch(`http://34.139.77.174/api/posts/${postId}`);
      if (!postResponse.ok) {
        throw new Error(`Failed to fetch post info: ${postResponse.status}`);
      }
      const postData = await postResponse.json();
      setPost(postData);
  
      // Fetch the original poster's user details
      const originalPosterResponse = await fetch(`http://34.139.77.174/api/user/${postData.UserID}`);
      if (!originalPosterResponse.ok) {
        throw new Error(`Failed to fetch original poster info: ${originalPosterResponse.status}`);
      }
      const originalPosterData = await originalPosterResponse.json();
      setOriginalPoster({
        UserID: originalPosterData.UserID,
        Username: originalPosterData.Username,
        ProfilePicture: originalPosterData.ProfilePicture,
      });
  
      // Get the user info for each reply
      const repliesWithUserInfo = await Promise.all(
        repliesData.map(async (reply: Reply) => {
          const userResponse = await fetch(`http://34.139.77.174/api/user/${reply.UserID}`);
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user ${reply.UserID}: ${userResponse.status}`);
          }
          const userData = await userResponse.json();
          return {
            ...reply,
            Username: userData.Username,
            ProfilePicture: userData.ProfilePicture,
          };
        })
      );
  
      setReplies(repliesWithUserInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return; // Don't submit if the reply text is empty

    try {
      const userId = await AsyncStorage.getItem('UserID');
      if (!userId) {
        throw new Error('UserID not found');
      }
      const response = await fetch(`http://34.139.77.174/api/posts/${postId}/replies/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: parseInt(userId),
          ReplyText: replyText
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit reply: ${response.status}`);
      }

      const newReply = await response.json();

      const userResponse = await fetch(`http://34.139.77.174/api/user/${userId}`);
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userResponse.status}`);
      }
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
      setReplyText(''); // Clear the input field after submission
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Prompt Section */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            {prompt?.PromptText || 'Loading prompt...'}
          </Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{prompt?.Category || 'Category'}</Text>
          </View>
        </View>

        {/* Main Post */}
        {originalPoster && post && (
          <View style={styles.mainPost}>
            <View style={styles.userInfo}>
              {/* <Image
                source={{
                  uri: originalPoster.ProfilePicture || 'https://via.placeholder.com/30',
                }}
                style={styles.avatar}
              /> */}
              <Text style={styles.username}>
                {originalPoster.Username || 'Anonymous'}
              </Text>
            </View>
            <Text style={styles.mainAnswer}>{post.PostText}</Text>
            <View style={styles.voteContainer}>
              <Text style={styles.voteCount}>{post.UpvoteCount || 0}</Text>
            </View>
          </View>
        )}

        {/* Replies Section */}
        {replies.map((reply) => (
          <View key={reply.ReplyID} style={styles.replyContainer}>
            <View style={styles.userInfo}>
              {/* <Image
                source={{
                  uri: reply.ProfilePicture || 'https://via.placeholder.com/30',
                }}
                style={styles.avatar}
              /> */}
              <Text style={styles.username}>
                {reply.Username} replied...
              </Text>
            </View>
            <Text style={styles.replyText}>{reply.ReplyText}</Text>
          </View>
        ))}

        {/* Reply Input */}
        <View style={styles.replyInputContainer}>
          <Text style={styles.replyInputLabel}>
            Reply to {originalPoster?.Username || 'someone'}...
          </Text>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Type your reply..."
            placeholderTextColor="#666"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleReplySubmit}
        >
          <Text style={styles.submitButtonText}>Submit Reply</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <Navbar activeNav={"Trending"} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background
  },
  scrollView: {
    flex: 1,
  },
  promptContainer: {
    padding: 20,
  },
  promptText: {
    color: '#000', // Dark text color for light theme
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter background for category tag
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#000', // Dark text for category tag
    fontSize: 14,
  },
  mainPost: {
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    color: '#000', // Dark text color for username
    fontSize: 14,
  },
  mainAnswer: {
    color: '#000', // Dark text for the main post
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  voteContainer: {
    marginTop: 10,
  },
  voteCount: {
    color: '#000', // Dark text color for votes
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  replyContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)', // Light divider color for replies
  },
  replyText: {
    color: '#000', // Dark text color for replies
    fontSize: 14,
    marginTop: 5,
  },
  replyInputContainer: {
    padding: 20,
  },
  replyInputLabel: {
    color: '#000', // Dark label text for the reply input
    fontSize: 16,
  },
  replyInput: {
    height: 40,
    borderColor: '#000', // Dark border color
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginTop: 10,
    color: '#000', // Dark text color for the input
  },
  submitButton: {
    backgroundColor: '#007BFF', // Button color remains the same
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  submitButtonText: {
    color: '#fff', // White text on button
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    backgroundColor: '#f8f8f8', // Light background for the navbar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)', // Light border for the navbar
  },
});
