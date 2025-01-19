import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Replace with your API URL
const API_BASE_URL = 'http://34.139.77.174/api';

export default function DailyPrompt() {
  const [prompt, setPrompt] = useState<string>(''); // Stores the prompt of the day
  const [category, setCategory] = useState<string>(''); // Stores the category of the prompt
  const [userResponse, setUserResponse] = useState<string>(''); // Stores user's answer
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch the "Prompt of the Day" from the backend
  useEffect(() => {
    const fetchPrompt = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/prompt_of_the_day/`);
        if (!response.ok) {
          throw new Error('Failed to fetch prompt of the day');
        }
        const data = await response.json();
        setPrompt(data.PromptText); // Assumes the API response has a "PromptText" field
        setCategory(data.Category); // Assumes the API response has a "Category" field
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load the prompt of the day.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, []);

  // Handle submitting the user's response
  const handleSubmit = async () => {
    if (!userResponse.trim()) {
      Alert.alert('Error', 'Your response cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PromptText: prompt,
          UserResponse: userResponse,
          Category: category, // Sends the category along with the response
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit your response');
      }

      Alert.alert('Success', 'Your response has been submitted!');
      setUserResponse(''); // Clear the input field
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit your response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View>
          {/* Prompt of the Day */}
          <Text style={styles.title}>prompt of the day</Text>
          <Text style={styles.promptText}>{prompt}</Text>

          {/* Category */}
          {category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}

          {/* User Response Input */}
          <TextInput
            style={styles.input}
            placeholder="Type your answer here..."
            placeholderTextColor="#999"
            value={userResponse}
            onChangeText={setUserResponse}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  promptText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
