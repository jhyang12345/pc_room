from models import Profile
from django.utils import timezone
import datetime

p = Profile("test", datetime.now, True, "")
