# Sign Language Game Setup (keras_model.h5)

This project now includes a sign-language pass/fail game at:
- Route: `/game/sign-match`
- Frontend page: `frontend/src/pages/games/SignMatch.jsx`
- Python inference API: `backend/sign_inference_server.py`

## 1) Model file
Place your trained model at:
- `d:\Luminaaa\keras_model.h5`

(Already detected in your project.)

## 2) Labels file (important)
Create this file (recommended):
- `d:\Luminaaa\sign_labels.txt`

Put one class label per line in the exact order used during model training, for example:

A
B
C
HELLO
THANK_YOU
YES
NO

If `sign_labels.txt` is missing, labels default to `class_0`, `class_1`, etc.

## 3) Python dependencies
From `d:\Luminaaa\backend` install:
- `pip install -r requirements-sign-model.txt`

## 4) Start inference API
From `d:\Luminaaa\backend` run:
- `python sign_inference_server.py`

Default API:
- `http://127.0.0.1:8000`

Health check:
- `GET http://127.0.0.1:8000/health`

## 5) Start frontend
From `d:\Luminaaa\frontend` run:
- `npm run dev`

Then open the sign game from Games screen.

## Optional env vars
- `SIGN_MODEL_PATH`
- `SIGN_LABELS_PATH`
- `SIGN_NORMALIZATION` (`teachable` default, or `zero_one`)
- `SIGN_HOST`
- `SIGN_PORT`

## Note on accuracy
If predictions are poor, check:
1. Label order in `sign_labels.txt`
2. Normalization mode (`teachable` vs `zero_one`)
3. Lighting and hand visibility
4. Camera frame distance/pose consistency with training data
