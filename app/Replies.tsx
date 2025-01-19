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
      console.log(repliesData);

      // Fetch prompt details with proper error handling
      const promptResponse = await fetch(`http://34.139.77.174/api/prompt/${promptId}`);
      if (!promptResponse.ok) {
        throw new Error(`Failed to fetch prompt: ${promptResponse.status}`);
      }
      const promptData = await promptResponse.json();
      setPrompt(promptData);
  
      // Get the user info for each reply with error handling
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
            ProfilePicture: userData.ProfilePicture
          };
        })
      );
  
      setReplies(repliesWithUserInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
      // You might want to add some error state handling here
      // setError(error.message);
    } finally {
      setIsLoading(false);
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
        {originalPoster && (
          <View style={styles.mainPost}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri: originalPoster.ProfilePicture || 'https://via.placeholder.com/30',
                }}
                style={styles.avatar}
              />
              <Text style={styles.username}>
                {originalPoster.Username || 'Anonymous'} says...
              </Text>
            </View>
            <Text style={styles.mainAnswer}>Taylor Swift</Text> {/* Replace with the main post content if available */}
            <View style={styles.voteContainer}>
              <Text style={styles.voteCount}>110</Text> {/* Replace with vote count if needed */}
            </View>
          </View>
        )}
  
        {/* Replies Section */}
        {replies.map((reply) => (
          <View key={reply.ReplyID} style={styles.replyContainer}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri: reply.ProfilePicture || 'https://via.placeholder.com/30',
                }}
                style={styles.avatar}
              />
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
      </ScrollView>
  
      {/* Bottom Navigation */}
      <Navbar activeNav={"Trending"} />
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
  promptContainer: {
    padding: 20,
  },
  promptText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
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
    color: '#fff',
    fontSize: 14,
  },
  mainAnswer: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  voteContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  voteCount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  replyContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  replyIcon: {
    marginLeft: 'auto',
  },
  replyText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  replyInputContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  replyInputLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  replyInput: {
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  plusButton: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});