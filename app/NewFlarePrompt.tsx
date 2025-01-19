import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import { Category } from '../NewFlareCategory'; // Assuming Category is defined

type NewFlarePromptNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewFlarePrompt'
>;

type NewFlarePromptRouteProp = RouteProp<RootStackParamList, 'NewFlarePrompt'>;

const pastPrompts = [
  'Which university has the best computer science program?',
  'Which university is the best?',
  'Which university will be the NCAA champion this year?',
];

export default function NewFlarePrompt() {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const navigation = useNavigation<NewFlarePromptNavigationProp>();
  
  // Retrieve category from navigation params
  const route = useRoute<NewFlarePromptRouteProp>();
  const { category } = route.params;

  const handleCreate = () => {
    const finalPrompt = selectedPrompt || prompt;
    if (finalPrompt) {
      // Create the prompt logic here
      navigation.navigate('NewFlarePost', { prompt: finalPrompt });
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

        <ScrollView style={styles.scrollContainer}>
          {pastPrompts.map((item, index) => (
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
          ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createText}>create</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});
