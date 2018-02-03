from django.db import models
from django.dispatch import receiver
import pymongo
from pc_profile.CafeProfile import CafeProfile

# Create your models here.
class Profile(models.Model):

    profile_name = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=50, unique=True)
    added_date = models.DateField('date published')
    supported = models.BooleanField(default=False)
    grid_shape = models.TextField(max_length=600, default="")
    grid_data = models.TextField(max_length=600, default="", blank=True, null=True)
    lat = models.DecimalField(max_digits=10, decimal_places=7, default=100.00)
    lng = models.DecimalField(max_digits=10, decimal_places=7, default=100.00)
    pc_title = models.CharField(max_length=20, default="")
    pc_subtitle = models.CharField(max_length=20, default="")
    address = models.CharField(max_length=60, default="")
    phone_number = models.CharField(max_length=20, default="")
    phone_address = models.CharField(max_length=20, default="")
    pc_specs = models.CharField(max_length=100, default="")
    owners_words = models.CharField(max_length=100, default="")
    total_seats = models.CharField(max_length=10, default="")


    def __str__(self):
        return self.profile_name

@receiver(models.signals.post_save, sender=Profile)
def execute_after_save(sender, instance, created, *args, **kwargs):
    if created:
        c = CafeProfile(name=instance.profile_name, id=instance.id)
        c.save_profile()
