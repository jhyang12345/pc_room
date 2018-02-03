from pymongo import MongoClient
from picture_reader.CafeProfile import CafeProfile

port_number = 27018

def delete_all(dbh):
    dbh.profile_list.delete_many({"name": "Pica_test"})

def update_anchor(dbh, name, image):
    dbh.profile_list.update_one(
        {
        "name": name
        },
        {
        "$set": {
            "anchor_image": image
        }
        }
    )

def update_reference_color(dbh, name, color):
    dbh.profile_list.update_one(
        {
        "name": name
        },
        {
        "$set": {
            "color": color
        }
        }
    )

def update_base_grid(dbh, name, grid):
    dbh.profile_list.update_one(
        {
        "name": name
        },
        {
        "$set": {
            "base_grid": grid
        }
        }
    )

def main():
    try:
        c = MongoClient(host='localhost', port=port_number)
        dbh = c["profile_db"]
        delete_all(dbh)
        # update_base_grid(dbh, "initial_test", """
        # ***.***
        # .......
        # ***.***
        # ***.***
        # .......
        # ***.***
        # ***.***
        # .......
        # ***.***
        # """)
    except Exception as e:
        print(e)
        print("Failed to connect to db!")

if __name__ == '__main__':
    main()
