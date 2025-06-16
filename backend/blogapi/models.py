from django.db import models

class Item(models.Model):
    title = models.CharField(max_length=200)
    # -- add any other fields you need, e.g. description, price, etc. --

    created_at = models.DateTimeField(auto_now_add=True)   # optional helpers
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:          # nice in the admin
        return self.title



class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Like(models.Model):
    post = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
