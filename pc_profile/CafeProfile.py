from pymongo import MongoClient

class CafeProfile:
    name = ""
    grid_corners = []
    grid_cell_locations = []
    anchor_image = ""
    color = (255, 255, 255)
    port_number = 27018

    def __init__(self, name="default", grid_corners=[],
                    grid_cell_locations=[], anchor_image="filename.png", base_grid="",
                    color=(255, 255, 255), id=0):
        self.name = name
        self.grid_corners = grid_corners
        self.grid_cell_locations = grid_cell_locations
        self.anchor_image = anchor_image
        self.base_grid = base_grid.strip()
        self.color = color
        self.id = id

    def save_profile(self):
        try:
            c = MongoClient(host='localhost', port=self.port_number)
            dbh = c["profile_db"]
            profile = {
                'name': self.name,
                'grid_corners': self.grid_corners,
                'grid_cell_locations': self.grid_cell_locations,
                'anchor_image': self.anchor_image,
                'color': self.color,
                'base_grid': self.base_grid.strip(),
                'id': self.id
            }
            dbh.profile_list.update({"name": self.name}, profile, upsert=True)

        except Exception as e:
            print(e)
            print("Failed to connect to db!")

if __name__ == '__main__':
    profile = CafeProfile()
    profile.save_profile()
