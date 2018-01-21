from django.db import models
from django.dispatch import receiver
import pymongo
from pc_profile.CafeProfile import CafeProfile

# Create your models here.
class Profile(models.Model):

    profile_name = models.CharField(max_length=200)
    password = models.CharField(max_length=50)
    added_date = models.DateField('date published')
    supported = models.BooleanField(default=False)
    grid_shape = models.TextField(max_length=300, default="")

    def __str__(self):
        return self.profile_name

@receiver(models.signals.post_save, sender=Profile)
def execute_after_save(sender, instance, created, *args, **kwargs):
    if created:
        c = CafeProfile(name=instance.profile_name, id=instance.id)
        c.save_profile()
