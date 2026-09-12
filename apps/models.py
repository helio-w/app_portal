from django.db import models

# Create your models here.
class Application(models.Model):
    title = models.CharField(max_length=255, unique=True)
    url = models.URLField()
    icon = models.ImageField(blank=True)
    description = models.CharField(max_length=255, blank=True)

    date_added = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"<Apps {self.title}>"