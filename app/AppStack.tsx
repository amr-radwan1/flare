import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrendingScreen from './Trending';

const AppStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen 
        name="TrendingScreen" 
        component={TrendingScreen} 
        options={{ title: 'Trending' }} 
      />
    </AppStack.Navigator>
  );
}
