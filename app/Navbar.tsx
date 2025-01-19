import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

type TrendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Navbar'>;

type NavbarProps = {
  activeNav: string;
};

const Navbar: React.FC<NavbarProps> = ({ activeNav }) => {
  const navigation = useNavigation<TrendingScreenNavigationProp>();

  const handleNavigation = (screen: keyof RootStackParamList) => {
    console.log(screen)
    navigation.navigate(screen as any);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => handleNavigation('DailyPrompt')}>
        <Cloud size={24} color="#fff" strokeWidth={activeNav === 'dailyprompt' ? 4 : 1} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('Trending')}>
        <Thermometer size={24} color="#fff" strokeWidth={activeNav === 'trending' ? 4 : 1} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('NewFlareCategory')}>
        <Plus size={24} color="#fff" strokeWidth={activeNav === 'newFlare' ? 4 : 1} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Search size={24} color="#fff" strokeWidth={activeNav === 'search' ? 4 : 1} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('ProfileScreen')}>
        <User size={24} color="#fff" strokeWidth={activeNav === 'profile' ? 4 : 1} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 20,
  },
});

export default Navbar;
