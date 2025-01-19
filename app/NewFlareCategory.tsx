import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Navbar from './Navbar';

export interface Category {
  id: string;
  label: string;
  icon: string;
}

const categories = [
  { id: 'sports', label: 'sports', icon: '🏈' },
  { id: 'music', label: 'music', icon: '🎵' },
  { id: 'movies', label: 'movies', icon: '🎬' },
  { id: 'food', label: 'food', icon: '🍽' },
  { id: 'fashion', label: 'fashion', icon: '🧥' },
  { id: 'tech', label: 'tech', icon: '📱' },
  { id: 'travel', label: 'travel', icon: '🌍' },
  { id: 'edu', label: 'education', icon: '📚' },
  { id: 'politics', label: 'politics', icon: '⚖️' },
  { id: 'health', label: 'health', icon: '🩺' },
  { id: 'fitness', label: 'fitness', icon: '🏋️‍♂️' },
];

type NewFlareCategoryNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewFlareCategory'
>;

export default function NewFlareCategory() {
  const navigation = useNavigation<NewFlareCategoryNavigationProp>();

  const handleCategorySelect = (category: { label: string; icon: string }) => {
    navigation.navigate('NewFlarePrompt', { category }); // Passing category to NewFlarePrompt
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>new flare</Text>

        <View style={styles.content}>
          <Text style={styles.subtitle}>choose a category</Text>

          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryText}>
                  {category.icon} {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'Libre Baskerville',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'Libre Baskerville',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    width: 100,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Libre Baskerville',
  },
});
