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
import Navbar from './Navbar'; // Import the Navbar component

export default function DailyPrompt() {
    const [promptText, setPromptText] = useState(''); // To store the fetched prompt text
    const [category, setCategory] = useState(''); // To store the fetched category
    const [userResponse, setUserResponse] = useState(''); // To store the user's input
    const [loading, setLoading] = useState(true); // To show a loading spinner when fetching data

    // Fetch the prompt with prompt_id = 3
    const fetchPrompt = async () => {
        try {
            const response = await fetch('http://34.139.77.174/api/prompt/3'); // Fetch the specific prompt
            if (!response.ok) {
                throw new Error(`Failed to fetch prompt: ${response.status}`);
            }
            const data = await response.json();
            setPromptText(data.PromptText);
            setCategory(data.Category);
        } catch (error) {
            console.error('Error fetching the prompt:', error);
        } finally {
            setLoading(false); // Stop showing the spinner
        }
    };

    // Handle submitting the user's response
    const handleSubmit = async () => {
        try {
            const postResponse = await fetch('http://34.139.77.174/api/posts/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    PostText: userResponse,
                    PromptText: promptText,
                    Category: category,
                    UserID: 1, // Assuming you have the UserID (hardcoded or from AsyncStorage)
                    PromptID:3
                }),
            });

            if (!postResponse.ok) {
                throw new Error(`Failed to post response: ${postResponse.status}`);
            }

            const responseData = await postResponse.json();
            console.log('Post successfully created:', responseData);
            alert('Your response has been submitted!'); // Notify the user
            setUserResponse(''); // Clear the input field
        } catch (error) {
            console.error('Error submitting the response:', error);
            alert('Failed to submit your response. Please try again.');
        }
    };

    // Fetch the prompt when the component mounts
    useEffect(() => {
        fetchPrompt();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />;
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.outsideContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>prompt of the day</Text>

                    <View style={{ height: 100 }}></View>

                    {/* Display the fetched prompt */}
                    <Text style={styles.subtitle}>{promptText}</Text>

                    {/* Display the fetched category */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>
                            {category}
                        </Text>
                    </View>

                    <View style={{ height: 40 }} />

                    {/* Input Field for User Response */}
                    <View style={styles.inputGroup}>
                        <View style={{ maxWidth: 350 }}>
                            <TextInput
                                style={styles.input}
                                value={userResponse}
                                onChangeText={setUserResponse}
                                placeholder="Your response..."
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
        </TouchableWithoutFeedback>
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
        paddingHorizontal: 12,
        paddingVertical: 10,
        maxHeight: 100,
        width: 300,
        fontSize: 16,
        elevation: 3,
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    categoryContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 20,
        maxHeight: 60,
        elevation: 3,
    },
    categoryText: {
        fontSize: 18,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#333',
        padding: 16,
        marginBottom: 16,
        borderRadius: 20,
        maxHeight: 60,
        elevation: 3,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
