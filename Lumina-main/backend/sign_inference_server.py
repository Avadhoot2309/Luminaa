"""
Sign Language Inference Server
Using cvzone (exactly like the working code)
"""

import base64
import io
import math
import os
from pathlib import Path

import cv2
import numpy as np
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image


ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_MODEL_PATH = ROOT_DIR / "keras_model.h5"
DEFAULT_LABELS_PATH = ROOT_DIR / "sign_labels.txt"

# Configuration (from working code)
OFFSET = 60
IMG_SIZE = 400


def _read_labels(path: Path):
    if not path.exists():
        return None

    labels = []
    for line in path.read_text(encoding="utf-8").splitlines():
        clean = line.strip()
        if clean:
            labels.append(clean)
    return labels if labels else None


def _get_model_path():
    model_path = os.getenv("SIGN_MODEL_PATH")
    if model_path:
        return Path(model_path).resolve()
    return DEFAULT_MODEL_PATH


def _get_labels_path():
    labels_path = os.getenv("SIGN_LABELS_PATH")
    if labels_path:
        return Path(labels_path).resolve()
    return DEFAULT_LABELS_PATH


MODEL_PATH = _get_model_path()
LABELS_PATH = _get_labels_path()

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

# Initialize cvzone detector and classifier
detector = HandDetector(maxHands=1)
classifier = Classifier(str(MODEL_PATH), str(LABELS_PATH))

# Load labels
raw_labels = _read_labels(LABELS_PATH)
if raw_labels:
    LABELS = raw_labels
else:
    LABELS = [f"class_{i}" for i in range(11)]  # Default 11 classes

app = Flask(__name__)
CORS(app)


def _extract_image_bytes(payload: str) -> bytes:
    if not payload:
        raise ValueError("Missing image payload")

    # Accept data URLs or pure base64
    if "," in payload:
        payload = payload.split(",", 1)[1]

    return base64.b64decode(payload)


def _detect_hand_and_crop(image_bytes: bytes):
    """
    Process image exactly like the working cvzone code
    Returns: (prediction_index, confidence, processed_image_white, hand_bbox)
    """
    # Convert bytes to numpy array
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

    # Detect hands using cvzone
    hands_list, img_processed = detector.findHands(img)

    hand_bbox = None
    img_white = np.ones((IMG_SIZE, IMG_SIZE, 3), np.uint8) * 255
    prediction_index = 0
    confidence = 0.0

    if hands_list:
        hand = hands_list[0]
        x, y, w, h = hand["bbox"]

        # Safe cropping (from working code)
        y1 = max(0, y - OFFSET)
        y2 = min(img.shape[0], y + h + OFFSET)
        x1 = max(0, x - OFFSET)
        x2 = min(img.shape[1], x + w + OFFSET)

        img_crop = img[y1:y2, x1:x2]

        # Aspect ratio handling (from working code)
        aspect_ratio = h / w

        if aspect_ratio > 1:
            # Height is larger
            k = IMG_SIZE / h
            w_cal = math.ceil(k * w)
            img_resize = cv2.resize(img_crop, (w_cal, IMG_SIZE))
            w_gap = math.ceil((IMG_SIZE - w_cal) / 2)
            img_white[:, w_gap : w_cal + w_gap] = img_resize
        else:
            # Width is larger
            k = IMG_SIZE / w
            h_cal = math.ceil(k * h)
            img_resize = cv2.resize(img_crop, (IMG_SIZE, h_cal))
            h_gap = math.ceil((IMG_SIZE - h_cal) / 2)
            img_white[h_gap : h_cal + h_gap, :] = img_resize

        # Get prediction from classifier
        prediction, index = classifier.getPrediction(img_white, draw=False)
        prediction_index = index
        confidence = float(prediction[index])

        # Store hand bbox for visualization
        hand_bbox = {
            "x": x - OFFSET,
            "y": y - OFFSET,
            "w": w + 2 * OFFSET,
            "h": h + 2 * OFFSET,
            "label": LABELS[index] if index < len(LABELS) else f"class_{index}",
        }

    return prediction_index, confidence, img_white, hand_bbox


@app.get("/health")
def health():
    return jsonify(
        {
            "ok": True,
            "model_path": str(MODEL_PATH),
            "num_classes": len(LABELS),
            "labels": LABELS,
            "img_size": IMG_SIZE,
            "offset": OFFSET,
        }
    )


@app.post("/predict")
def predict():
    try:
        body = request.get_json(silent=True) or {}
        image_payload = body.get("image")
        image_bytes = _extract_image_bytes(image_payload)

        prediction_index, confidence, _, _ = _detect_hand_and_crop(image_bytes)

        label = LABELS[prediction_index] if prediction_index < len(LABELS) else f"class_{prediction_index}"

        return jsonify(
            {
                "ok": True,
                "prediction": {
                    "index": prediction_index,
                    "label": label,
                    "confidence": confidence,
                },
            }
        )
    except Exception as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400


@app.post("/debug")
def debug():
    """Debug endpoint: returns processed image and hand detection data"""
    try:
        body = request.get_json(silent=True) or {}
        image_payload = body.get("image")
        image_bytes = _extract_image_bytes(image_payload)

        prediction_index, confidence, img_white, hand_bbox = _detect_hand_and_crop(
            image_bytes
        )

        # Convert processed image to base64
        _, buffer = cv2.imencode(".jpg", img_white)
        img_base64 = base64.b64encode(buffer).decode()

        hand_data = None
        if hand_bbox:
            hand_data = hand_bbox

        return jsonify(
            {
                "ok": True,
                "processedImage": f"data:image/jpeg;base64,{img_base64}",
                "handData": hand_data,
                "prediction": {
                    "index": prediction_index,
                    "label": LABELS[prediction_index]
                    if prediction_index < len(LABELS)
                    else f"class_{prediction_index}",
                    "confidence": confidence,
                },
            }
        )
    except Exception as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400


if __name__ == "__main__":
    host = os.getenv("SIGN_HOST", "127.0.0.1")
    port = int(os.getenv("SIGN_PORT", "8000"))
    app.run(host=host, port=port, debug=True)
