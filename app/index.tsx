import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font'; // Import expo-font



type indexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'index'>;

export default function Index() {
  const [Username, setUsername] = useState('');
  const navigation = useNavigation<indexScreenNavigationProp>();

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Libre Baskerville': require('../assets/fonts/LibreBaskerville-Bold.ttf'),
        // You can add more fonts if needed
      });
    }
    loadFonts();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!Username.trim()) {
        Alert.alert('Error', 'Please enter a username');
        return;
      }
      const response = await fetch('http://34.139.77.174/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username }),
      });

      if (response.ok) {
        const data = await response.json();

        const UserID = data.UserID;

        if (UserID) {
          await AsyncStorage.setItem('UserID', UserID.toString());
          navigation.navigate('Trending');
        }
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Login failed');
        console.error('Login failed:', errorData);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in');
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={{ height: 30 }} />
        {/* Centered Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/temp3.png')}
            style={styles.avatar}
          />
          <Text style={styles.logoText}>flare.</Text>
        </View>

        <View style={{ height: 30 }} />

        {/* Form Fields */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>username</Text>
          <TextInput
            style={styles.input}
            value={Username}
            onChangeText={setUsername}
            placeholder="jondoe23"
            placeholderTextColor="#666"
          />
        </View>


        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.loginButtonText} numberOfLines={1}>
            {isLoading ? 'logging in...' : 'log in'}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.signUpContainer}
        >
          <Text style={styles.signUpText}>sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center', // Center the logo horizontally
    marginBottom: 40, // Add spacing below the logo if needed
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 50,
    textAlign: 'center',
    fontFamily: 'Libre Baskerville',
  },
  formContainer: {
    alignItems: 'center',
    gap: 10,
    maxWidth: 300,
  },
  inputGroup: {
    gap: 8,
    alignSelf: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Libre Baskerville',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    fontFamily: "Libre Baskerville",
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    width: 300,
    elevation: 3,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 40,
    width: 150,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Libre Baskerville',
  },
  signUpContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Libre Baskerville',
  },
});

