from django.db import models
import uuid
from companies.models import Company

class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, related_name='jobs', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.JSONField()
    salary = models.IntegerField()
    location = models.CharField(max_length=255, choices=[('remote', 'Remote'), ('on-site', 'On-site')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title