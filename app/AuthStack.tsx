import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './index';
import Register from './Register';
import Trending from './Trending';
import ProfileScreen from './ProfileScreen';
import Replies from './Replies';
import EditProfileScreen from './EditProfile';
import DailyPrompt from './DailyPrompt';
import DailyFlare from './DailyFlare';
import NewFlareCategory from './NewFlareCategory';
import NewFlarePrompt from './NewFlarePrompt';
import NewFlarePost from './NewFlarePost';
import PostsForPrompt from './PostsForPrompt';

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
      <AuthStack.Screen name="DailyPrompt" component={DailyPrompt} />
      <AuthStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <AuthStack.Screen name="DailyFlare" component={DailyFlare}/>
      <AuthStack.Screen name="NewFlareCategory" component={NewFlareCategory} />
      <AuthStack.Screen name="NewFlarePrompt" component={NewFlarePrompt} />
      <AuthStack.Screen name="NewFlarePost" component={NewFlarePost} />
      <AuthStack.Screen name="PostsForPrompt" component={PostsForPrompt} />
    </AuthStack.Navigator>
  );
}
