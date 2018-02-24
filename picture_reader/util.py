import os
from skimage.measure import compare_ssim as ssim
from PIL import Image
import numpy as np
import datetime

def half(coords):
    i = 0
    while i < len(coords):
        coords.pop(i)
        i += 1

def grid_corners(text):
    coords_input = text.strip()
    coords = coords_input.split("\n")
    def split(coords):
        return list(map(float, coords.split()))
    coords = list(map(split, coords))
    half(coords)
    return coords

# returns cut image
def cut_image(grid_coords, image):
    top_left = grid_coords[0]
    bottom_right = grid_coords[1]
    width, height = image.size
    top_left = (int(top_left[0] * width), int(top_left[1] * height))
    bottom_right = (int(bottom_right[0] * width), int(bottom_right[1] * height))
    img = image.crop((top_left[0], top_left[1], bottom_right[0], bottom_right[1]))
    print(width, height)
    return img

def mse(imageA, imageB):
    err = np.sum((imageA.astype("float") - imageB.astype("float")) ** 2)
    err /= float(imageA.shape[0] * imageA.shape[1])
    return err

def get_ssim(imageA, imageB):
    s = ssim(imageA, imageB)
    return s

# Image passed is numpy array
def compare_to_anchor(image, anchor_file="images/hough/snap_171202_215637_hough.png"):
    anchor = Image.open(anchor_file)
    anchor = np.array(anchor)
    print(image.shape, anchor.shape)
    ssim_value = get_ssim(image, anchor)
    print("Similarity value:", ssim_value)
    print("MSE:", mse(image, anchor))
    return ssim_value

def get_date_time_stamp():
    now = datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S\t')
    return now
