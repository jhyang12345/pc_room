base_grid = """
|....|.....
|.||.||.|.|
|.||.||.|.|
|.||.||.|.|
|.||.||.|.|
|.||.||.|.|
|.||.||.|..
|.||.||.|..
|.||.||.|..
...........
|.||.|....|
|.||.|....|
|.||.|....|
|.||.|.##.|
"""

grid_data = """
-....-.....
-.--.+-.-.+
-.+-.+-.+.+
+.+-.--.-.+
+.+-.++.-.+
+.++.-+.-.+
-.--.+-.-..
-.+-.--.+..
-.--.+-.+..
...........
-.+-.+....+
+.+-.-....+
+.++.+....-
+.+-.+.##.-
"""


def get_over_two_components(grid_shape, grid_data):
    grid_shape = grid_shape.strip()
    grid_data = grid_data.strip()
    grid_shape = grid_shape.split("\n")
    grid_data = grid_data.split("\n")

    visited = [[False for x in range(len(grid_shape[0]))] for y in range(len(grid_shape))]

    total = 0
    over_two_total = 0
    largest_component = 0

    for i in range(len(grid_shape)):
        grid_shape[i] = grid_shape[i].strip()
        grid_data[i] = grid_data[i].strip()
    for y in range(len(grid_shape)):
        for x in range(len(grid_shape[0])):
            if(visited[y][x]): continue
            # - is empty
            if grid_data[y][x] == '-':
                component_size = 0
                i = x
                j = y
                # Grid shape implies the actual seat layout
                if grid_shape[y][x] == '|':
                    while(j < len(grid_shape) and grid_shape[j][i] == '|'
                        and grid_data[j][i] == '-'):
                        visited[j][i] = True
                        component_size += 1
                        j += 1

                elif grid_shape[y][x] == '-':
                    while(i < len(grid_shape) and grid_shape[j][i] == '-'
                        and grid_data[j][i] == '-'):
                        visited[j][i] = True
                        component_size += 1
                        i += 1
                if(component_size > 1):
                    over_two_total += component_size
                if(component_size > largest_component):
                    largest_component = component_size
                total += component_size
    return total, over_two_total, largest_component

if __name__ == '__main__':
    get_over_two_components(base_grid, grid_data)
