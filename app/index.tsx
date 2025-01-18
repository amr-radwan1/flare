import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Index() {
  const [Username, setUsername] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [isLoading, setIsLoading] = useState(false);

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

        // Navigate to TrendingScreen
        navigation.navigate('Trending');
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
        {/* Logo and App Name */}
        <Text style={styles.logo}>logo</Text>
        <Text style={styles.appName}>appname</Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
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
  logo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
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
  },
  signUpContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#000',
  },
});
