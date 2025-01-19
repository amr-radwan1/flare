import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';


type TrendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Navbar'>;


export default function Navbar() {
  const navigation = useNavigation<TrendingScreenNavigationProp>();

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen'); // Navigate to ProfileScreen
  };

  const navigateToTrending = () => {
    navigation.navigate('Trending'); // Navigate to Trending
  }

  
  return (
    <View style={styles.navbar}>
      <Cloud size={24} color="#fff" />
      <TouchableOpacity onPress={navigateToTrending}>
        <Thermometer size={24} color="#fff" />
      </TouchableOpacity>
      <Plus size={24} color="#fff" />
      <Search size={24} color="#fff" />
      <TouchableOpacity onPress={navigateToProfile}>
        <User size={24} color="#fff" /> {/* User Icon */}
      </TouchableOpacity>
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
});
