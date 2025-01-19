import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
} from 'react-native';
import Navbar from './Navbar'; // Import Navbar for consistency
import { useRoute } from '@react-navigation/native';

interface Response {
    id: number;
    UserID: number;
    Username: string;
    ProfilePicture: string;
    PostText: string;
    EngagementScore: number;
}

export default function DailyPromptFlare() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const route = useRoute();
    const { promptText, promptCategory, userAnswer } = route.params;

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                setIsLoading(true);

                // Fetch all responses for the current prompt
                const response = await fetch('http://34.139.77.174/api/posts'); // API endpoint for all posts
                const data = await response.json();

                // Filter responses related to the current prompt
                const filteredResponses = data.filter(
                    (post: Response) => post.PromptID === 3 // Replace with the correct prompt ID
                );

                setResponses(filteredResponses);
            } catch (error) {
                console.error('Error fetching responses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResponses();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    const renderResponse = ({ item }: { item: Response }) => (
        <View style={styles.responseCard}>
            <View style={styles.userInfo}>
                <Image
                    source={{ uri: item.ProfilePicture }}
                    style={styles.avatar}
                />
                <Text style={styles.username}>{item.Username} says...</Text>
            </View>
            <Text style={styles.responseText}>{item.PostText}</Text>
            <Text style={styles.engagementScore}>{item.EngagementScore} 🔥</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.promptText}>{promptText}</Text>
                <Text style={styles.categoryText}>
                    {promptCategory === 'sports' ? '🏈 Sports' : promptCategory}
                </Text>
            </View>
            <View style={styles.myAnswerContainer}>
                <Text style={styles.myAnswerLabel}>my answer</Text>
                <Text style={styles.myAnswerText}>{userAnswer}</Text>
            </View>
            <FlatList
                data={responses}
                renderItem={renderResponse}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
            <Navbar activeNav={'dailyprompt'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    promptText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 16,
        color: '#666',
    },
    myAnswerContainer: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        alignItems: 'center',
    },
    myAnswerLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    myAnswerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    responseCard: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
    },
    responseText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    engagementScore: {
        fontSize: 14,
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingBottom: 16,
    },
});
