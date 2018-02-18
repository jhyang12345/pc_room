from PIL import Image
from matplotlib.pyplot import imshow
from skimage.measure import structural_similarity as ssim
import numpy as np
import cv2
import time
import datetime
import os, sys
from picture_reader.util import *
from picture_reader.read_profiles import  read_data
from picture_reader.database_helper import update_profile_grid_info, update_profile_seats_info
from picture_reader.image_to_grid import *
from picture_reader.components_count import get_over_two_components

ssim_threshold = 0.95

threshold = 60
minLineLength = 30
dilate_iterations = 3

horizontal_threshold = 80
horizontal_minLineLength = 80

def make_empty_image(image):
    empty = Image.new("L", image.shape[::-1])
    empty = np.array(empty)
    return empty

def get_boundaries(image):
    #hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_black = np.array([0, 0, 0])
    upper_black = np.array([6, 6, 6])

    kernel = np.ones((3,3), np.uint8)

    mask = cv2.inRange(image, lower_black, upper_black)
    mask = cv2.dilate(mask, kernel, iterations=dilate_iterations)
    mask = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

    return mask

def process_img(image):
    original_image = image
    processed_img = image
    processed_img = get_boundaries(image)
    processed_img = cv2.cvtColor(processed_img, cv2.COLOR_BGR2GRAY)

    #processed_img = cv2.Canny(processed_img, threshold1 = 200, threshold2=300)
    #processed_img = cv2.GaussianBlur(processed_img, (5, 5), 0)

    kernel = np.ones((3,3), np.uint8)
    #processed_img = cv2.erode(processed_img, kernel, iterations=1)
    #processed_img = cv2.dilate(processed_img, kernel, iterations=1)

    threshold_candidates = [100, 200, 300, 400, 500]

    lineholder = []
    # Horizontal Lines
    lines = get_horizontal_lines(processed_img)
    # Vertical Lines
    lines2 = cv2.HoughLinesP(processed_img, 1, np.pi, threshold=threshold, minLineLength=minLineLength, maxLineGap=1)
    lineholder = [lines, lines2]
    empty_image = make_empty_image(processed_img)
    for i in range(len(lineholder)):
        lines = lineholder[i]
        try:
            if(i == 0):
                draw_horizontal_lines(empty_image, lines, 255)
                print("Horizontal lines")
                pass
            elif lines:
                draw_lines(empty_image, lines)
                pass

        except Exception as e:
            draw_lines(empty_image, lines)
            pass

    return processed_img, empty_image

def get_horizontal_lines(img):
    temp_image = img.T
    lines = cv2.HoughLinesP(temp_image, 1, np.pi, threshold=horizontal_threshold, minLineLength=horizontal_minLineLength, maxLineGap=1)
    return lines

def draw_lines(img, lines, color=255):
    try:
        for line in lines:
            coords = line[0]
            cv2.line(img, (coords[0], coords[1]), (coords[2], coords[3]), [color, color, color], 4)
    except:
        print("No lines detected")

def draw_horizontal_lines(img, lines, color=80):
    for line in lines:
        coords = line[0]
        cv2.line(img, (coords[1], coords[0]), (coords[3], coords[2]), [color, color, color], 4)


def make_filename(now):
    year = str(now.year)[-2:]
    month = str(now.month).rjust(2, "0")
    day = str(now.day).rjust(2, "0")
    hour = str(now.hour).rjust(2, "0")
    minute = str(now.minute).rjust(2, "0")
    seconds = str(now.second).rjust(2, "0")
    filename = "snap_" + year + month + day + "_" + hour + minute + seconds
    return filename

def handle_coords(value):
    text = value.strip()
    coords = text.split("\n")
    def split(coords):
        return list(map(float, coords.split()))
    coords = list(map(split, coords))
    return coords

# Handle image cropping, hough lines, ssim value
def generate_first_time(filename, pc_name, root_path=""):

    original_filename = filename
    img = Image.open(filename)

    item = read_data(pc_name=pc_name)

    img = cut_image(handle_coords(item.grid_corners), img)
    processed_image, empty_image = process_img(np.array(img))
    processed_image = Image.fromarray(processed_image, "L")
    hough_image = Image.fromarray(empty_image, "L")

    directory = os.path.join(root_path, "images", "snap")
    hough_directory = os.path.join(root_path, "images", "hough")
    mask_directory = os.path.join(root_path, "images", "mask")

    now = datetime.datetime.now()
    filename = make_filename(now) + ".png"

    # if not os.path.exists(directory):
    #     os.makedirs(directory)
    if not os.path.exists(hough_directory):
        os.makedirs(hough_directory)
    if not os.path.exists(mask_directory):
        os.makedirs(mask_directory)

    # Creating & Saving masked image
    mask_filename = make_filename(now) + "_mask" + ".png"
    mask_filename = os.path.join(mask_directory, mask_filename)
    processed_image.save(mask_filename)

    # Creating & Saving hough line image
    hough_filename = make_filename(now) + "_hough" + ".png"
    hough_filename = os.path.join(hough_directory, hough_filename)
    hough_image.save(hough_filename)

    # Set anchor image if not set!
    if(not item.anchor_image or not os.path.isfile(item.anchor_image)):
        item.anchor_image = hough_filename
        item.save()

    # filename = make_filename(now) + "_snap" + ".png"
    # filename = os.path.join(directory, filename)
    # img.save(filename)

    # SSIM Threshold is 0.95
    if(item.anchor_image):
        ssim_value = compare_to_anchor(np.array(hough_image), item.anchor_image)
        if(ssim_value > 0.95):
            grid_string = string_from_grid(handle_coords(item.grid_cell_locations),
                Image.open(original_filename), item.base_grid.strip(),
                [(item.r1, item.g1, item.b1), (item.r2, item.g2, item.b2), (item.r3, item.g3, item.b3)], item.empty_check)
            # updating hough image path if similar enough
            item.anchor_image = hough_filename
            item.save()
            # updating profile grid info
            update_profile_grid_info(pc_name, grid_string)
            empty_seats, two_empty_seats, largest_empty_seats = get_over_two_components(item.base_grid, grid_string)
            update_profile_seats_info(pc_name, empty_seats, two_empty_seats, largest_empty_seats)



def main():
    filename = sys.argv[1]
    pc_name = sys.argv[2]
    generate_first_time(filename, pc_name)

if __name__ == '__main__':
    main()
