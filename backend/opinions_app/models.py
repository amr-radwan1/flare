from django.db import models
from django.contrib.postgres.fields import ArrayField

class Prompt(models.Model):
    PromptID = models.AutoField(primary_key=True, db_column='promptid')
    PromptText = models.TextField(db_column='prompt_text')
    Category = models.TextField(db_column='category')
    
    class Meta:
        db_table = 'prompts'

class User(models.Model):
    UserID = models.AutoField(primary_key=True, db_column='userid')  
    Username = models.CharField(max_length=100, unique=True, db_column='username')
    Email = models.EmailField(unique=True, db_column='email')
    Password = models.CharField(max_length=255, db_column='password')
    ProfilePicture = models.CharField(max_length=200, null=True, db_column='profile_picture')
    JoinDate = models.DateTimeField(auto_now_add=True, db_column='join_date')
    Bio = models.TextField(null=True, db_column='bio')
    ReplyPoints = models.IntegerField(default=0, db_column='reply_points')
    Followers = ArrayField(models.IntegerField(), null=True, db_column='followers')  # Array of user IDs who follow this user

    class Meta:
        db_table = 'users'

class Post(models.Model):
    PostID = models.AutoField(primary_key=True, db_column='postid')
    PromptID = models.ForeignKey(Prompt, on_delete=models.SET_NULL, db_column='prompt_id', null=True)  # Relating to Prompt
    UserID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')  # Relating to User
    UpvoteCount = models.IntegerField(default=0, db_column='upvote_count')
    DownvoteCount = models.IntegerField(default=0, db_column='downvote_count')
    CreatedAt = models.DateTimeField(auto_now_add=True, db_column='created_at')
    PostText = models.TextField(db_column='posttext')
    
    class Meta:
        db_table = 'posts'


class Reply(models.Model):
    ReplyID = models.AutoField(primary_key=True, db_column='id')
    PostID = models.ForeignKey(Post, on_delete=models.CASCADE, db_column='post_id')  # Relating to Post
    UserID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')  # Relating to User
    ReplyText = models.TextField(db_column='reply_text')
    CreatedAt = models.DateTimeField(auto_now_add=True, db_column='created_at')
    isAgree = models.BooleanField(default=None, db_column='isagree')

    class Meta:
        db_table = 'replies'
        
