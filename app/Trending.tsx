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

  useEffect(() => {
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
    <View style={styles.container}>
      <Text style={styles.title}>trending</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
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
            <Text style={styles.categoryText}>
              {category.icon} {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.postsContainer}>
        {posts.map((post) => (
          <View key={post.PostID} style={styles.postCard}>
            {/* Access PromptText and Category from the post object */}
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
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,  // Reduced margin to make it smaller
  },
  categoryButton: {
    paddingHorizontal: 12, // Reduced horizontal padding
    paddingVertical: 6,    // Reduced vertical padding
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    width: 100, // Fixed width for the category buttons
    flexShrink: 1, // Prevent button from stretching
    justifyContent: 'center',  // Ensure text is centered vertically
    alignItems: 'center',      // Ensure text is centered horizontally
  },
  selectedCategory: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14, // Smaller font size for the category
    color: '#333',
    textAlign: 'center', // Ensure the text is centered
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
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
  },
});
