"""
Image preprocessing hook for future CNN or pretrained food recognition.

For a real deployment, replace classify_food_image with a TensorFlow/PyTorch model
trained on cafeteria food images. The backend already accepts image uploads and can
be extended to call this script or an ML microservice.
"""

import argparse
import json
from pathlib import Path

import cv2


def classify_food_image(image_path):
    image = cv2.imread(str(image_path))
    if image is None:
        return {"food_type": "mixed_meal", "confidence": 0.2}
    height, width = image.shape[:2]
    mean_bgr = image.mean(axis=(0, 1))
    if mean_bgr[1] > mean_bgr[2]:
        return {"food_type": "vegetable_curry", "confidence": 0.45, "width": width, "height": height}
    return {"food_type": "mixed_meal", "confidence": 0.35, "width": width, "height": height}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    args = parser.parse_args()
    print(json.dumps(classify_food_image(Path(args.image))))


if __name__ == "__main__":
    main()

