import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import * as Font from 'expo-font'; // Import expo-font
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar'; // Import the Navbar component
import { AlignCenter } from 'lucide-react-native';

const categories = [
    { id: 'sports', label: 'sports', icon: '🏈' },
    { id: 'music', label: 'music', icon: '🎵' },
    { id: 'movies', label: 'movies', icon: '🎬' },
    { id: 'food', label: 'food', icon: '🍽' },
    { id: 'fashion', label: 'fashion', icon: '🧥' },
    { id: 'tech', label: 'tech', icon: '📱' },
    { id: 'travel', label: 'travel', icon: '🌍' },
    { id: 'politics', label: 'politics', icon: '⚖️' },
    { id: 'health', label: 'health', icon: '🩺' },
    { id: 'fitness', label: 'fitness', icon: '🏋️‍♂️' },
];

type DailyPromptNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DailyPrompt'>;

export default function DailyPrompt() {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [promptText, setPromptText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('sports'); // Default to sports category

    const navigation = useNavigation<DailyPromptNavigationProp>();

    const handleSubmit = () => {
        console.log('Submitted:', promptText);
        // You can add logic to handle the prompt submission here
    };

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Libre Baskerville': require('../assets/fonts/LibreBaskerville-Bold.ttf'),
                'Libre Baskerville Bold': require('../assets/fonts/LibreBaskerville-Bold.ttf'),
            });
            setFontLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontLoaded) {
        return <ActivityIndicator size="large" color="#000" />;
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.outsideContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>prompt of the day</Text>

                    <View style={{ height: 100 }}></View>

                    <Text style={styles.subtitle}>this is a sample daily prompt question?</Text>


                    {/* Category */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>
                            {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.label}
                        </Text>
                    </View>

                    <View style={{ height: 40 }}>

                    </View>

                    <View style={styles.inputGroup}>
                        <View style={{ maxWidth: 350 }}>
                            <TextInput
                                style={styles.input}
                                // value={Username}
                                // onChangeText={setUsername}
                                placeholder="A hot take, if you flare..."
                                placeholderTextColor="#666"
                            />
                        </View>


                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>send flare</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Navbar activeNav={'dailyprompt'} />
            </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        gap: 10,
        alignItems: 'center',
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
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    outsideContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    container: {
        backgroundColor: '#fff',
        paddingTop: 60,
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 8,
        fontFamily: 'Libre Baskerville',
    },
    subtitle: {
        fontSize: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontFamily: 'Libre Baskerville',
        textAlign: 'center',
    },
    categoryContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        paddingHorizontal: 12,
        paddingVertical: 6,
        maxHeight: 60,
        elevation: 3,

    },
    categoryText: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Libre Baskerville',
    },
    textInput: {
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 20,
        marginBottom: 20,
        maxHeight: 50,
        maxWidth: 300,
        fontFamily: 'Libre Baskerville',
    },
    submitButton: {
        backgroundColor: '#333',
        padding: 16,
        marginBottom: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        maxHeight: 60,
        elevation: 3,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Libre Baskerville Bold',
    },
});
