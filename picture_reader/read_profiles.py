from pc_profile.models import Profile, ProfileImageGuide

port_number = 27018
#
# def read_data_list(dbh=None):
#     if not dbh:
#         try:
#             c = MongoClient(host='localhost', port=port_number)
#             dbh = c["profile_db"]
#         except Exception as e:
#             print("Failed to connect to db!")
#     data_list = dbh.profile_list.find({})
#     print(list(data_list))

# def read_data(pc_name="", dbh=None):
#     if not dbh:
#         try:
#             c = MongoClient(host='localhost', port=port_number)
#             dbh = c["profile_db"]
#         except Exception as e:
#             print("Failed to connect to db!")
#     data_list = list(dbh.profile_list.find({"name": pc_name}))
#     ret = None
#     for data in data_list:
#         ret = CafeProfile(data["name"], data["grid_corners"], data["grid_cell_locations"],
#             data["anchor_image"], data["base_grid"], data["color"])
#     return ret

def read_data(pc_name=""):
    try:
        ret = ProfileImageGuide.objects.get(profile_name=pc_name)
        return ret
    except:
        return None
