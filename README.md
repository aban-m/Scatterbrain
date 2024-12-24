# Scatterbrain
A tool for visualizing text and photo embeddings. The project uses the OpenAI embedding model for text and GPT-4 Vision to convert photos into text The project is partially an exercise in learning React and full-stack web development in general.  
A demo is available at https://aban-m.github.io/Scatterbrain.

## Overview
[Embeddings](https://en.wikipedia.org/wiki/Sentence_embedding) are a way to convert data (typically, text or images) to vectors (which are essentially points) in a high-dimensional space. This is done in a way such that, if Text A is similar to Text B, then they are represented by points that are close together. They have wide applications: Classifying texts, semantic search, face recognition, and more.  
The dimensions of these vectors are often in the thousands, so they are impossible to visualize. We use [PCA](https://en.wikipedia.org/wiki/Principal_component_analysis) (Principal Component Analysis), a linear dimensionality reduction technique, to project them to 2D or 3D space. This naturally results in some loss of information, but the resulting visualizations are often insightful nevertheless.

## Getting started
### Prerequisites
- Python 3.10 or later.
- [Node.js](https://nodejs.org/) (tested with v22).
The project has a Flask (Python) backend and a React frontend. All storage is done at the server, currently persisted in a Sqlite3 database.  
First, clone the repository:
```bash
git clone https://github.com/aban-m/Scatterbrain.git
```

### Backend
#### Setting up the environment
This project uses [uv](https://github.com/astral-sh/uv) for package management. These steps (executed in the `backend` folder) set up the environment.
```bash
pip install uv      # (if not installed)
uv sync
```
Two environment variables should be set:
- `OPENAI_API_KEY`, which should be a valid [OpenAI API key](https://platform.openai.com/).
- `FLASK_SECRET_KEY`, a random string that is used for signing cookies. (If it is not set, a random key will be chosen, but then restarting the server will invalidate all sessions).
#### Running the server
First, the database must be initialized via [manage.py](https://github.com/aban-m/Scatterbrain/blob/master/backend/server/db/manage.py).
```bash
uv run server/db/manage.py init
```
The default database path is shown when running `manage.py`. It could be overriden by setting the environment variable `DATABASE`.  
Now the server is ready to run. Run the following command to start the server at `localhost:5000`:
```bash
uv run flask --app server run --port 5000
```

### Frontend
Install the dependencies by running the following command in the `frontend` directory:
```bash
npm install
```
Set VITE_API_HOST to http://localhost:5000 to configure the API host. Either set it up directly or create the file `frontend/envs/.env.local` with the following content:
```
VITE_API_HOST=http://localhost:5000
```
Finally, run the Vite development server:
```bash
npm run dev
```

## Roadmap
**Technical:**
- [ ] Write a script for removing old content from the database.
- [ ] Containerize the whole project.
- [ ] Add tests.
- [ ] _Rewrite the backend in JavaScript._

**Features:**
- [ ] Add native support for image processing by using models like [CLIP](https://openai.com/index/clip/).
- [ ] Add semantic search functionality.
- [ ] Visualize clustering algorithms.
