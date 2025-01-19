import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Navbar from './Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from './NewFlareCategory';

type RouteParams = {
  category: Category;
  prompt: string;
};

export default function NewFlarePost() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params as RouteParams;
  const { category, prompt } = data;

  const [answer, setAnswer] = useState('');

  const handleCancel = () => {
    navigation.goBack();
  };

  const handlePost = async () => {
    if (answer.trim()) {
      try {
        const userId = await AsyncStorage.getItem('UserID');
        if (!userId) {
          alert('User ID not found. Please log in again.');
          return;
        }

        // Step 1: Create a new prompt entry
        const promptResponse = await fetch('http://34.139.77.174/api/prompts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PromptText: prompt, // The prompt text passed to this screen
            Category: category.label, // The category label
          }),
        });

        if (!promptResponse.ok) {
          throw new Error(`Failed to create the prompt: ${promptResponse.status}`);
        }

        const promptData = await promptResponse.json();
        const promptId = promptData.PromptID; // Assuming the response includes the created prompt ID

        // Step 2: Create a new post entry
        const createdAt = new Date().toISOString(); // Current date-time for post creation

        console.log(userId, createdAt, answer.trim(), promptId);
        const postResponse = await fetch('http://34.139.77.174/api/posts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserID: userId, // Logged-in user's ID
            UpvoteCount: 0, // Initial upvote count
            DowmvoteCount: 0, // Initial downvote count
            CreatedAt: createdAt, // Time of post creation
            PostText: answer.trim(), // User's answer
            PromptID: promptId, // Link this post to the created prompt
          }),
        });

        if (!postResponse.ok) {
          throw new Error(`Failed to create the post: ${postResponse.status}`);
        }

        alert('Your post has been successfully submitted!');
        setAnswer(''); // Clear the input field
        navigation.navigate('Trending'); // Navigate to the Trending screen
      } catch (error) {
        console.error('Error creating the post:', error);
        alert('Failed to create the post. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>new flare</Text>

        <Text style={styles.subtitle}>{prompt}</Text>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {category.icon} {category.label}
          </Text>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Type your answer..."
          value={answer}
          onChangeText={setAnswer}
          multiline
          autoFocus
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, !answer.trim() && styles.disabledButton]}
            onPress={handlePost}
            disabled={!answer.trim()}
          >
            <Text style={styles.createText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Bar */}
      <Navbar activeNav="newFlare" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Libre Baskerville',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Libre Baskerville',
  },
  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Libre Baskerville',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#000',
    fontSize: 16,
  },
  createText: {
    color: '#fff',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
