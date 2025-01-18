import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './index';
import Register from './Register';
import Trending from './Trending';

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
    </AuthStack.Navigator>
  );
}
