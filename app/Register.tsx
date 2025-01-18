import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
  });

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://34.139.77.174/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: formData.username }),
      });

      if (response.ok) {
        const data = await response.json();
        navigation.navigate('index');
        Alert.alert('Success', 'Registration successful!');
        console.log('Registration successful:', data);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Registration failed');
        console.error('Registration failed:', errorData);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while registering');
      console.error('Error during registration:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
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
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              placeholder="jondoe23"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>first name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="john"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>last name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="doe"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <Cloud size={24} color="#000" />
        <Thermometer size={24} color="#000" />
        <Plus size={24} color="#000" />
        <Search size={24} color="#000" />
        <User size={24} color="#000" />
      </View> */}
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
  signUpButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 40,
    width: 100,
    alignSelf: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

