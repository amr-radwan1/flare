import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Thermometer, Plus, Search, User } from 'lucide-react-native';

interface Post {
  PostID: string;
  PromptID: string;
  PostText: string;
  UpvoteCount: number;
  DownvoteCount: number;
}

interface Prompt {
  PromptID: string;
  PromptText: string;
  Category: string;
}

interface FlareCard {
  prompt: Prompt;
  post: Post;
}

const FlareCard = ({ prompt, post }: { prompt: Prompt; post: Post }) => (
  <View style={styles.card}>
    <Text style={styles.questionText}>{prompt.PromptText}</Text>
    <View style={styles.answerContainer}>
      <Text style={styles.answerText}>{post.PostText}</Text>
      <View style={styles.scoreContainer}>
        <Thermometer size={24} color="#ff69b4" />
        <Text style={styles.scoreText}>{post.UpvoteCount}</Text>
      </View>
    </View>
  </View>
);

export default function ProfileScreen() {
  // This would normally come from your data source
  const controversyScore = 25;
  
  const flares: FlareCard[] = [
    {
      prompt: {
        PromptID: "1",
        PromptText: "who is the greatest basketball player ... ?",
        Category: "sports"
      },
      post: {
        PostID: "1",
        PromptID: "1",
        PostText: "Michael Jordan",
        UpvoteCount: 40,
        DownvoteCount: 0
      }
    },
    {
      prompt: {
        PromptID: "2",
        PromptText: "who is the most overrated singer of ... ?",
        Category: "music"
      },
      post: {
        PostID: "2",
        PromptID: "2",
        PostText: "Taylor Swift",
        UpvoteCount: 110,
        DownvoteCount: 0
      }
    },
    {
      prompt: {
        PromptID: "3",
        PromptText: "kiss, kill, marry: descartes, hume, ... ?",
        Category: "philosophy"
      },
      post: {
        PostID: "3",
        PromptID: "3",
        PostText: "Hume, Rousseau, Descartes",
        UpvoteCount: 12,
        DownvoteCount: 0
      }
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-18%20at%204.09.52%E2%80%AFPM-Q1yVXqjeHe9790R00cMhIk5txDRrf9.png' }}
              style={styles.avatar}
            />
            <Text style={styles.username}>john doe</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editProfile}>edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Controversy Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.controversyTitle}>your controversy{'\n'}score is...</Text>
          <Text style={styles.controversyScore}>{controversyScore}</Text>
        </View>

        {/* Flares Section */}
        <View style={styles.flaresSection}>
          <Text style={styles.flaresTitle}>your flares...</Text>
          {flares.map((flare, index) => (
            <FlareCard key={index} prompt={flare.prompt} post={flare.post} />
          ))}
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Cloud size={24} color="#fff" />
        <Thermometer size={24} color="#fff" />
        <Plus size={24} color="#fff" />
        <Search size={24} color="#fff" />
        <User size={24} color="#fff" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editProfile: {
    color: '#666',
    fontSize: 16,
  },
  scoreSection: {
    alignItems: 'center',
    padding: 20,
  },
  controversyTitle: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  controversyScore: {
    color: '#fff',
    fontSize: 72,
    fontWeight: 'bold',
  },
  flaresSection: {
    padding: 20,
  },
  flaresTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  questionText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    color: '#ff69b4',
    fontSize: 16,
    marginLeft: 5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});