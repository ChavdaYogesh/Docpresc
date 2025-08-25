# Medicine ML Service

This folder contains a lightweight ML microservice to recommend over-the-counter medicines from symptom text.

## Prerequisites
- Python 3.10+
- PowerShell (Windows)

## Setup (Windows PowerShell)
```
cd ml
python -m venv .venv
# If activation is blocked, run this in the same PowerShell window once:
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Train the model
```
python train.py
```
This creates `model.pkl` in the `ml` folder.

## Run the inference server
```
python -m uvicorn serve:app --host 0.0.0.0 --port 8000
```

## Test
- Health: `GET http://localhost:8000/health`
- Predict: `POST http://localhost:8000/predict` with JSON body:
```
{
  "symptoms": "headache fever",
  "age": 25,
  "gender": "Male",
  "medicalHistory": ""
}
```

You should receive a list of 1-3 recommendations with confidence scores.
