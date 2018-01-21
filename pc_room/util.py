import datetime

def make_filename(now):
    year = str(now.year)[-2:]
    month = str(now.month).rjust(2, "0")
    day = str(now.day).rjust(2, "0")
    hour = str(now.hour).rjust(2, "0")
    minute = str(now.minute).rjust(2, "0")
    seconds = str(now.second).rjust(2, "0")
    filename = "image_" + year + month + day + "_" + hour + minute + seconds
    return filename
