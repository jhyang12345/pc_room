from django.db import models
from django.dispatch import receiver
import pymongo

# Create your models here.
class Profile(models.Model):

    profile_name = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=50, unique=True)
    added_date = models.DateField('date published')
    supported = models.BooleanField(default=False)
    grid_shape = models.TextField(max_length=600, default="")
    grid_data = models.TextField(max_length=600, default="", blank=True, null=True)

    empty_seats = models.IntegerField(default=0)
    two_empty_seats = models.IntegerField(default=0)
    largest_empty_seats = models.IntegerField(default=0)

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
    try:
        ret = ProfileImageGuide.objects.get(profile_name=instance.profile_name)
    except:
        ret = None
    if not ret or created:
        p = ProfileImageGuide(profile_name=instance.profile_name)
        p.save()

class ProfileImageGuide(models.Model):
    profile_name = models.CharField(max_length=200, unique=True)
    grid_corners = models.TextField(max_length=100, default="", blank=True, null=True)
    grid_cell_locations = models.TextField(default="", blank=True, null=True)
    base_grid = models.TextField(default="", blank=True, null=True)
    anchor_image = models.CharField(max_length=100, default="", blank=True, null=True)
    # RGB is for the occupied seats
    r = models.IntegerField(default=0, blank=True, null=True)
    g = models.IntegerField(default=0, blank=True, null=True)
    b = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return self.profile_name
