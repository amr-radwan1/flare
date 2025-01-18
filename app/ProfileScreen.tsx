import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
  PostID: string;
  PromptID: string;
  PostText: string;
  UpvoteCount: number;
  DownvoteCount: number;
}

const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('UserID');
    if (userId !== null) {
      return userId;
    }
    console.log('User not logged in');
    return null;
  } catch (error) {
    console.error('Error retrieving userId from AsyncStorage', error);
    return null;
  }
};

export default function ProfileScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const userId = await getUserId();
        if (!userId) {
          setError('User ID is not available');
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(`http://34.139.77.174/api/user/${userId}/posts`);
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const controversyScore = 25;

  const renderPosts = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#fff" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!posts.length) {
      return <Text style={styles.emptyText}>No posts yet</Text>;
    }

    return posts.map((post, index) => (
      <View key={post.PostID || index} style={styles.card}>
        <Text style={styles.questionText}>Prompt ID: {post.PromptID}</Text>
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{post.PostText}</Text>
          <View style={styles.scoreContainer}>
            <Thermometer size={24} color="#ff69b4" />
            <Text style={styles.scoreText}>{post.UpvoteCount}</Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-18%20at%204.09.52%E2%80%AFPM-Q1yVXqjeHe9790R00cMhIk5txDRrf9.png' }}
              style={styles.avatar}
            />
            <Text style={styles.username}>john doe</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editProfile}>edit profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.controversyTitle}>your controversy{'\n'}score is...</Text>
          <Text style={styles.controversyScore}>{controversyScore}</Text>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.postsTitle}>your posts...</Text>
          {renderPosts()}
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <Cloud size={24} color="#fff" />
        <Thermometer size={24} color="#fff" />
        <Plus size={24} color="#fff" />
        <Search size={24} color="#fff" />
        <User size={24} color="#fff" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editProfile: {
    color: '#666',
    fontSize: 16,
  },
  scoreSection: {
    alignItems: 'center',
    padding: 20,
  },
  controversyTitle: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  controversyScore: {
    color: '#fff',
    fontSize: 72,
    fontWeight: 'bold',
  },
  postsSection: {
    padding: 20,
  },
  postsTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  questionText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    color: '#ff69b4',
    fontSize: 16,
    marginLeft: 5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 20,
  },
});
