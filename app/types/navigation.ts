import { Category } from '../NewFlareCategory'; 

export type RootStackParamList = {
  index: undefined;
  Register: undefined;
  Trending: undefined;
  ProfileScreen: undefined;
  Navbar: undefined;
  Replies: {
    postId: number;
    promptId: number;
  };
  NewFlareCategory: {category: Category};
  NewFlarePrompt: {category: Category};
  DailyPrompt: undefined;
  EditProfileScreen: undefined;
};

