# opinions_app/urls.py
from django.urls import path
from .views import UserListView, PostListView, FollowerListView, PromptListView, GetPromptView, GetUserByIdView, TotalVotesView
from .views import UpdateVotesView, RegisterUserView, GetRepliesView, LoginUserView, GetUserPostsView, GetPromptsByCategoryView, GetPostView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('users/<int:userid>/followers/', FollowerListView.as_view(), name='follower-list'),
    path('prompts/', PromptListView.as_view(), name='prompt-list'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('posts/<str:vote_type>/<int:post_id>/', UpdateVotesView.as_view(), name='update-votes'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('posts/<int:post_id>/replies/', GetRepliesView.as_view(), name='get_replies'),
    path('prompt/<int:prompt_id>/', GetPromptView.as_view(), name='get_prompt'),
    path('user/<int:user_id>/posts/', GetUserPostsView.as_view(), name='user-posts'),
    path('user/<int:user_id>/', GetUserByIdView.as_view(), name='get_user_by_id'),
    path('prompts/category/<str:category>/', GetPromptsByCategoryView.as_view(), name='get-prompts-by-category'),
    path('user/<int:user_id>/total-votes/', TotalVotesView.as_view(), name='get-user-total-votes'),
    path('posts/<int:post_id>/', GetPostView.as_view(), name='get-post'),
]
