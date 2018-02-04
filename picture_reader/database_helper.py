from pc_profile.models import Profile

def update_profile_grid_info(profile_name, grid_string):
    try:
        p = Profile.objects.get(profile_name=profile_name)
        p.grid_data = grid_string
        p.save()
    except:
        pass

def update_profile_seats_info(profile_name, empty_seats, two_empty_seats, largest_empty_seats):
    try:
        p = Profile.objects.get(profile_name = profile_name)
        p.empty_seats = empty_seats
        p.two_empty_seats = two_empty_seats
        p.largest_empty_seats = largest_empty_seats
        p.save()
    except: pass


def main():
    pass

if __name__ == '__main__':
    main()
