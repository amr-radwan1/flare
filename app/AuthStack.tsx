import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './index';
import Register from './Register';
import Trending from './Trending';
import ProfileScreen from './ProfileScreen';
import Replies from './Replies';
<<<<<<< HEAD
=======
import EditProfileScreen from './EditProfile';
>>>>>>> dbf866100dd89abd0f3afe694316431d7b392653

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Index"
        component={Index}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="Trending" component={Trending} />
      <AuthStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <AuthStack.Screen name="Replies" component={Replies} />
<<<<<<< HEAD
=======
      <AuthStack.Screen name="DailyPrompt" component={DailyPrompt} />
      <AuthStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
>>>>>>> dbf866100dd89abd0f3afe694316431d7b392653
    </AuthStack.Navigator>
  );
}
