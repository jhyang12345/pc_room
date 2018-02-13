from PIL import Image
import os

def translate(coord, image):
    width = image.size[0]
    height = image.size[1]
    x = int(coord[0] * width)
    y = int(coord[1] * height)
    return (x, y)

def average_rgb(coord, image):
    rgb = [0, 0, 0]
    count = 0
    for x in range(-3, 4, 1):
        for y in range(-3, 4, 1):
            curpix = image.getpixel((coord[0] + x, coord[1] + y))
            rgb[0] += curpix[0]
            rgb[1] += curpix[1]
            rgb[2] += curpix[2]
            count += 1
    rgb[0] = rgb[0] // count
    rgb[1] = rgb[1] // count
    rgb[2] = rgb[2] // count
    rgb = tuple(rgb)
    return rgb

def absolute_error(value, color):
    ret = 0
    for i in range(len(value)):
        ret += abs(value[i] - color[i])
    return ret

def string_from_grid(coords, image, base_grid, colors):
    ret = ""
    color_grid = []
    for coord in coords:
        value = average_rgb(translate(coord, image), image)
        color_grid.append(value)
        smallest_error = 100
        # check all the colors for the color that is closest
        for color in colors:
            # if color is -1 pass
            if(color[0] == -1): continue
            smallest_error = min(smallest_error, absolute_error(value, color))

        if smallest_error < 20: # empty seats
            ret += "+"
        else: # taken seats
            ret += "-"
    base_grid = iterate_base_grid(base_grid, ret, color_grid)
    return base_grid

def iterate_base_grid(base_grid, ret, color_grid, column_sort=True):
    base_grid = base_grid.strip()
    base_grid = base_grid.split()
    base_grid = list(map(list, base_grid))
    seat_grids = []
    for y in range(len(base_grid)):
        for x in range(len(base_grid[0])):
            val = base_grid[y][x]
            if(val == "|" or val == "-"):
                seat_grids.append([x, y])
    print(len(ret), len(seat_grids))
    if column_sort:
        seat_grids = sorted(seat_grids, key = lambda x: (x[0], x[1]))
    else:
        seat_grids = sorted(seat_grids, key = lambda x: (x[1], x[0]))
    for i in range(len(ret)):
        seat = seat_grids[i]
        base_grid[seat[1]][seat[0]] = ret[i]
    for i in range(len(base_grid)):
        base_grid[i] = "".join(base_grid[i])
    base_grid = "\n".join(base_grid)
    print(base_grid)
    return base_grid

base_grid = """
***.***
.......
***.***
***.***
.......
***.***
***.***
.......
***.***
"""
