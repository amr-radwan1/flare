import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import * as Font from 'expo-font'; // Import expo-font
import { useNavigation } from '@react-navigation/native';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';


interface Post {
  PostID: string;
  PromptID: string;
  PostText: string;
  UpvoteCount: number;
  DownvoteCount: number;
}

interface Prompt {
  PromptID: string;
  PromptText: string;
  Category: string;
}


const categories = [
  { id: 'sports', label: 'Sports', icon: '🏈' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'food', label: 'Food', icon: '🍽' },
];
type TrendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Trending'>;

export default function Trending() {
  const [posts, setPosts] = useState<(Post & { prompt?: Prompt })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const navigation = useNavigation<TrendingScreenNavigationProp>();

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen'); // Navigate to ProfileScreen
  };

  const navigateToCloud = () => {
    navigation.navigate('DailyPrompt');
  }

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Libre Baskerville': require('../assets/fonts/LibreBaskerville-Bold.ttf'),
        // You can add more fonts if needed
      });
    }
    loadFonts();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {

      const response = await fetch('http://34.139.77.174/api/posts');
      const data = await response.json();

      // Sort by total engagement and take top 20
      const sortedPosts = data
        .sort((a: Post, b: Post) =>
          (b.UpvoteCount + b.DownvoteCount) - (a.UpvoteCount + a.DownvoteCount)
        )
        .slice(0, 20);

      // Fetch prompt data for each post
      const postsWithPrompts = await Promise.all(
        sortedPosts.map(async (post: Post) => {
          try {
            const promptResponse = await fetch(`http://34.139.77.174/api/prompt/${post.PromptID}`);

            if (!promptResponse.ok) {
              console.error('Failed to fetch prompt for post:', post.PromptID);
              return { ...post, PromptText: '', Category: '' }; // Return post with empty values in case of error
            }

            const prompt = await promptResponse.json();
            const { PromptText, Category } = prompt;

            return { ...post, PromptText, Category }; // Add only the PromptText and Category to the post
          } catch (error) {
            console.error('Error fetching prompt:', error);
            return { ...post, PromptText: '', Category: '' }; // Return post with empty values in case of error
          }
        })
      );



      setPosts(postsWithPrompts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.outsideContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>trending today</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriesContainer,
            { height: 40 }, // Example height
          ]}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText,
                ]}
              >
                {category.icon} {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.PostID} style={styles.postCard}>
              {post.PromptText && (
                <Text style={styles.promptText}>
                  {post.PromptText}
                </Text>
              )}
              <Text style={styles.postText}>
                {post.PostText}
              </Text>
              <View style={styles.voteContainer}>
                <Text style={styles.voteCount}>
                  {post.UpvoteCount + post.DownvoteCount}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.navbar}>
            <TouchableOpacity onPress={navigateToProfile} >
              <Cloud size={24} color="#fff" />
            </TouchableOpacity>
            <Thermometer size={24} color="#fff" />
            <Plus size={24} color="#fff" />
            <Search size={24} color="#fff" />
            <TouchableOpacity onPress={navigateToProfile} >
              <User size={24} color="#fff" /> {/* User Icon */}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.navbar}>
        <Cloud size={28} color="#fff" />
        <Thermometer size={28} color="#fff" strokeWidth={4} />
        <Plus size={28} color="#fff" />
        <Search size={28} color="#fff" />
        <TouchableOpacity onPress={navigateToProfile}>
          <User size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 20,
  },
  outsideContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // Ensures content and navbar are spaced out
  },
  container: {
    backgroundColor: '#fff',
    paddingTop: 60,
    flex: 1, // Takes up the remaining space, pushing the navbar down
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'Libre Baskerville',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    width: 100,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#000',
    color: '#FFFFF'
  },
  selectedCategoryText: {
    color: '#fff',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Libre Baskerville',
  },
  postsContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginRight: 8,
    fontFamily: 'Libre Baskerville',
  },
  postText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Libre Baskerville',
  },
  voteContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Libre Baskerville',
  },
});
