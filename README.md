# GlucoTrack

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)

**GlucoTrack** is a local data science project aiming to integrate a complete ETL pipeline, data analysis, and Machine Learning for diabetes risk prediction, with a modern user interface (React + Tailwind CSS).

## Project Structure

- **data/** – data files (raw, processed)
- **notebooks/** – Jupyter notebooks for exploration and prototyping
- **src/**
  - **etl/** – ETL scripts (extract-transform-load)
  - **ml/** – Machine Learning scripts (training & inference)
  - **utils/** – utility/helper functions
- **app/** – React frontend
- **requirements.txt** – required Python packages
- **README.md** – project description, setup instructions

## Quick Setup

1. Install Python dependencies:
    ```
    pip install -r requirements.txt
    ```

2. Install frontend dependencies:
    ```
    cd app
    npm install
    ```

3. (Optional) Launch Jupyter Notebook:
    ```
    jupyter notebook
    ```

---

**Project status:** In development (restart on 2025-05-28)

---

## TODO

- [ ] Download & prepare NHANES dataset
- [ ] Initial ETL script
- [ ] Data exploration
- [ ] Simple ML model
- [ ] Minimal React frontend
