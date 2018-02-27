from django.db import models
from django.dispatch import receiver
from django.utils import timezone
from imagekit.models import ImageSpecField, ProcessedImageField
from imagekit.processors import ResizeToFit

# Create your models here.

# Main profile model for a pc_room profile
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

# a receiver to create an associated ProfileImageGuide after a Profile is created
@receiver(models.signals.post_save, sender=Profile)
def execute_after_save(sender, instance, created, *args, **kwargs):
    print("After Profile Save!")
    try:
        ret = ProfileImageGuide.objects.get(profile_name=instance.profile_name)
    except:
        ret = None
    if not ret or created:
        p = ProfileImageGuide(profile_name=instance.profile_name)
        p.save()

# ProfileImageGuide model to guide image recognition procedure
class ProfileImageGuide(models.Model):
    profile_name = models.CharField(max_length=200, unique=True)
    grid_corners = models.TextField(max_length=100, default="", blank=True, null=True)
    grid_cell_locations = models.TextField(default="", blank=True, null=True)
    base_grid = models.TextField(default="", blank=True, null=True)
    anchor_image = models.CharField(max_length=100, default="", blank=True, null=True)

    vertical_threshold = models.IntegerField(default=60, blank=True, null=True)
    vertical_minLineLength = models.IntegerField(default=30, blank=True, null=True)
    horizontal_threshold = models.IntegerField(default=80, blank=True, null=True)
    horizontal_minLineLength = models.IntegerField(default=80, blank=True, null=True)

    # boolean if set as False, the colors are used to match taken seats
    empty_check = models.BooleanField(default=False)

    # RGB is for the occupied seats
    r1 = models.IntegerField(default=0, blank=True, null=True)
    g1 = models.IntegerField(default=0, blank=True, null=True)
    b1 = models.IntegerField(default=0, blank=True, null=True)

    # RGB is for the occupied seats
    r2 = models.IntegerField(default=-1, blank=True, null=True)
    g2 = models.IntegerField(default=-1, blank=True, null=True)
    b2 = models.IntegerField(default=-1, blank=True, null=True)

    # RGB is for the occupied seats
    r3 = models.IntegerField(default=-1, blank=True, null=True)
    g3 = models.IntegerField(default=-1, blank=True, null=True)
    b3 = models.IntegerField(default=-1, blank=True, null=True)

    def __str__(self):
        return self.profile_name

# Model to handle reports
class Report(models.Model):
    report_title = models.TextField(default="빈 제목", blank=True, null=True)
    report_content = models.TextField(default="", blank=True, null=True)
    reply_email = models.CharField(max_length=50, default="", blank=True, null=True)
    report_date = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self):
        return self.report_title

# Image based model to handle Images of pc_rooms
class ProfileImage(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    index = models.IntegerField(default=-1, blank=True, null=True)
    # image = models.ImageField(upload_to='profile_images/')
    image = ProcessedImageField(upload_to='profile_images/',
                                           processors=[ResizeToFit(1000, 1000)],
                                           format='JPEG',
                                           options={'quality': 60}, null=True, blank=True)
    image_thumbnail = ProcessedImageField(upload_to='profile_thumbnails/',
                                           processors=[ResizeToFit(200, 200)],
                                           format='JPEG',
                                           options={'quality': 100}, null=True, blank=True)

    def save(self, *args, **kwargs):
        # execute specially handled save only in
        if(self.index == -1):
            index = self.get_next_key()
            self.index = index
        index = self.index
        image_name, image_extension = self.get_image_name()
        image_name = image_name + "_" + str(index)
        image_name = image_name + "." + image_extension
        self.image.name = image_name
        super(ProfileImage, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.image)

    def get_next_key(self):
        profileImages = ProfileImage.objects.filter(profile=self.profile)
        print(profileImages)
        if profileImages:
            return len(profileImages)
        else:
            return 0

    def get_image_name(self):
        extension = self.image.name.split('.')[1]
        name = self.profile.profile_name
        name = name.split()
        name = "_".join(name)
        return name, extension
