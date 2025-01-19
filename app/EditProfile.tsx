import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Go Back Button */}
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/images/profile.jpg')} // Path to your local image
          style={styles.avatar}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  goBackText: {
    fontSize: 16,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 150, // Adjust size as needed
    height: 150,
    borderRadius: 75, // Makes the image circular
  },
});
