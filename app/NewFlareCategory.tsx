import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Navbar from './Navbar';

interface Category {
  id: string;
  label: string;
  icon: string;
}

const categories: Category[] = [
  { id: 'sports', label: 'Sports', icon: '🏀' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'movies', label: 'Movies', icon: '🍿' },
  { id: 'fashion', label: 'Fashion', icon: '👔' },
  { id: 'travel', label: 'Travel', icon: '🌎' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'tech', label: 'Tech', icon: '📱' },
  { id: 'health', label: 'Health', icon: '⚕️' },
  { id: 'fitness', label: 'Fitness', icon: '🏃' },
  { id: 'edu', label: 'Edu', icon: '📚' },
  { id: 'drinks', label: 'Drinks', icon: '🍹' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
];
type NewFlareCategoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewFlareCategory'>;

export default function NewFlareScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const navigation = useNavigation<NewFlareCategoryNavigationProp>();
  
    const navigateToProfile = () => {
      navigation.navigate('ProfileScreen'); // Navigate to ProfileScreen
    };

    const navigateToPlus = () => {
        navigation.navigate('NewFlareCategory'); 
      };
  
    const navigateToCloud = () => {
      navigation.navigate('DailyPrompt')
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
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
        <View style={styles.navbar}>
            <TouchableOpacity onPress={navigateToCloud} >
            <Cloud size={24} color="#fff" />
            </TouchableOpacity>
            <Thermometer size={24} color="#fff" />
            <TouchableOpacity onPress={navigateToPlus} >
                <Plus size={24} color="#fff" />
            </TouchableOpacity>
            <Search size={24} color="#fff" />
            <TouchableOpacity onPress={navigateToProfile} >
            <User size={24} color="#fff" /> {/* User Icon */}
            </TouchableOpacity>
        </View>
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
  selectedCategory: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Libre Baskerville',
  },
  selectedCategoryText: {
    color: '#fff',
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