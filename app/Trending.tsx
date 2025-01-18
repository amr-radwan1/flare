import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';

// Types for our data
// Types for our data
interface Post {
    PostID: string;
    promptText: string; // Updated from "question" to "promptText"
    PostText: string;
    category: string; // Category from the prompts table
    UpvoteCount: number;
    DownvoteCount: number;
}
  
const categories = ['Sports', 'Music', 'Movies', 'Food'];

export default function Trending() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://34.139.77.174/api/posts');
      const data = await response.json();
      
      // Sort posts by absolute vote count (both upvotes and downvotes)
      const sortedPosts = data.sort((a: Post, b: Post) => {
        const aTotalVotes = Math.abs(a.UpvoteCount) + Math.abs(a.DownvoteCount);
        const bTotalVotes = Math.abs(b.UpvoteCount) + Math.abs(b.DownvoteCount);
        return bTotalVotes - aTotalVotes;
      });
      
      // Get top 20 posts
      setPosts(sortedPosts.slice(0, 20));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const getVoteIcon = (post: Post) => {
    // Determine which count to show based on which is higher
    const showUpvotes = post.UpvoteCount > post.DownvoteCount;
    const count = showUpvotes ? post.UpvoteCount : post.DownvoteCount;
    
    return (
      <View style={[styles.voteContainer, { backgroundColor: showUpvotes ? '#ffebee' : '#fff3e0' }]}>
        <Text style={styles.voteCount}>{count}</Text>
        <Text style={styles.voteEmoji}>{showUpvotes ? '🔥' : '❄️'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>trending</Text>
      
      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(
              selectedCategory === category ? null : category
            )}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts List */}
      <ScrollView style={styles.postsContainer}>
        {filteredPosts.map((post) => (
          <View key={post.PostID} style={styles.postContainer}>
            <View style={styles.postContent}>
              <Text style={styles.question}>{post.promptText}</Text> {/* Updated to use promptText */}
              <Text style={styles.answer}>{post.PostText}</Text>
            </View>
            {getVoteIcon(post)}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Cloud size={24} color="#000" />
        <Thermometer size={24} color="#000" />
        <Plus size={24} color="#000" />
        <Search size={24} color="#000" />
        <User size={24} color="#000" />
      </View>
    </SafeAreaView>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  categoryTextActive: {
    color: '#fff',
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  postContent: {
    flex: 1,
    paddingRight: 16,
  },
  question: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  answer: {
    fontSize: 16,
    fontWeight: '600',
  },
  voteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 8,
    padding: 8,
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  voteEmoji: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

