import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Navbar from './Navbar';

type NewFlarePromptNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewFlarePrompt'
>;

type NewFlarePromptRouteProp = RouteProp<RootStackParamList, 'NewFlarePrompt'>;

export default function NewFlarePrompt() {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [pastPrompts, setPastPrompts] = useState<string[]>([]); // Dynamically fetched prompts
  const [loading, setLoading] = useState<boolean>(false); // To manage loading state
  const [error, setError] = useState<string | null>(null); // To handle API errors

  const navigation = useNavigation<NewFlarePromptNavigationProp>();
  
  // Retrieve category from navigation params
  const route = useRoute<NewFlarePromptRouteProp>();
  const { category } = route.params;

  useEffect(() => {
    if (!category) return; // If no category, exit early

    // Set loading state to true before fetching
    setLoading(true);
    setError(null); // Reset any previous error

    // API call to fetch prompts based on category
    const fetchPrompts = async () => {
      try {
        const response = await fetch(`http://34.139.77.174/api/prompts/category/${category.label}`);
        const data = await response.json();
        console.log(data); // Log the API response

        // Extract PromptText from the response data and set it to pastPrompts
        if (data && Array.isArray(data)) {
          const prompts = data.map((item: { PromptText: string }) => item.PromptText);
          setPastPrompts(prompts); // Store the extracted PromptText values
        } 
      } catch (err) {
        console.error(err);
        setError('Failed to fetch prompts.');
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchPrompts(); // Call the fetch function
  }, [category]); // Re-run effect when `category` changes

  const handleCreate = () => {
    const finalPrompt = selectedPrompt || prompt;
    // we also need to pass the category to NewFlarePost
    
    if (finalPrompt) {
      // Create the prompt logic here
      navigation.navigate('NewFlarePost', { prompt: finalPrompt, category });
    }
  };

  const handleCancel = () => {
    navigation.navigate('NewFlareCategory');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>new flare</Text>

        {/* Display the category label and icon */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {category.icon} {category.label}
          </Text>
        </View>

        <Text style={styles.subtitle}>start typing a prompt</Text>
        <Text style={styles.instructions}>
          once you select an existing prompt or type your own, hit create
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Type your question here..."
          placeholderTextColor="#aaa"
          value={prompt}
          onChangeText={(text) => {
            setPrompt(text);
            setSelectedPrompt(null); // Clear selection when user types
          }}
        />

        <Text style={styles.chooseFrom}>choose from:</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading prompts...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView style={styles.scrollContainer}>
            {pastPrompts.length > 0 ? (
              pastPrompts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.promptItem,
                    selectedPrompt === item && styles.selectedPrompt,
                  ]}
                  onPress={() => {
                    setSelectedPrompt(item);
                    setPrompt(''); // Clear input when selecting a prompt
                  }}
                >
                  <Text
                    style={[
                      styles.promptText,
                      selectedPrompt === item && styles.selectedPromptText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noPromptsText}>No prompts available for this category.</Text>
            )}
          </ScrollView>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createText}>create</Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Libre Baskerville',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  chooseFrom: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  promptItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  selectedPrompt: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  promptText: {
    fontSize: 14,
    color: '#333',
  },
  selectedPromptText: {
    color: '#000',
    fontWeight: 'bold',
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
  cancelText: {
    color: '#000',
    fontSize: 16,
  },
  createText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#ff0000',
    fontSize: 16,
  },
  noPromptsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
