@echo off
REM ASTRA-DURGA — one-command start for Windows.
REM Run this from the project root (the folder this file is in).

setlocal

if not exist ".venv\Scripts\activate.bat" (
    echo [ASTRA] No virtual environment found at .venv
    echo [ASTRA] Create one first:
    echo     py -3.14 -m venv .venv
    echo     .venv\Scripts\activate
    echo     pip install -r requirements.txt
    exit /b 1
)

call ".venv\Scripts\activate.bat"

if not exist ".env" (
    echo [ASTRA] .env not found — copying from .env.example
    copy ".env.example" ".env" >nul
)

echo [ASTRA] Starting server at http://127.0.0.1:8000
echo [ASTRA]   Real voice mode:      http://127.0.0.1:8000/
echo [ASTRA]   SIH simulation mode:  http://127.0.0.1:8000/simulate
echo [ASTRA]   API docs:             http://127.0.0.1:8000/docs
echo [ASTRA] Press CTRL+C to stop.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

endlocal
