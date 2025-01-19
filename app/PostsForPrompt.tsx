import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from './Navbar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

type TrendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostsForPrompt'>;


interface Response {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  answer: string;
  metric: number;
}

const responses: Response[] = [
  {
    id: '1',
    user: {
      name: 'alex smith',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    answer: 'Kobe Bryant',
    metric: 62,
  },
  {
    id: '2',
    user: {
      name: 'jane doe',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    answer: 'LeBron James',
    metric: 25,
  },
  {
    id: '3',
    user: {
      name: 'will grim',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    answer: 'Stephen Curry',
    metric: 93,
  },
];

export default function PromptView() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Question Header */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            who is the greatest basketball player of all time?
          </Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>🏀 Sports</Text>
          </View>
        </View>

        {/* My Answer */}
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>my answer</Text>
          <View style={styles.myAnswerBox}>
            <Text style={styles.answerText}>Michael Jordan</Text>
            <View style={styles.metricBox}>
              <Text style={styles.metricText}>40</Text>
            </View>
          </View>
        </View>

        {/* Other Responses */}
        {responses.map((response) => (
          <View key={response.id} style={styles.responseContainer}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: response.user.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{response.user.name} says...</Text>
            </View>
            <View style={styles.responseBox}>
              <Text style={styles.answerText}>{response.answer}</Text>
              <View style={styles.metricBox}>
                <Text style={styles.metricText}>{response.metric}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <Navbar activeNav="search"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1b4332',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagContainer: {
    alignItems: 'center',
  },
  tagText: {
    fontSize: 16,
    color: '#666',
  },
  answerContainer: {
    marginBottom: 20,
  },
  answerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  myAnswerBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseContainer: {
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    color: '#666',
  },
  responseBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  answerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  metricBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    padding: 5,
  },
});

