# VideoTube — Frontend

The frontend for **VideoTube**, a full-stack, YouTube-style video sharing platform. Built with React and Tailwind CSS, it lets users browse and upload videos, comment, like, subscribe to channels, post short "tweets," build playlists, and view channel analytics.

- **Live demo:** [videotube-frontend-two.vercel.app](https://videotube-frontend-two.vercel.app/)
- **Backend repo:** [backend_project](https://github.com/HPatil224/backend_project)

> Note: the backend is hosted on Render's free tier, so the first request after a period of inactivity may take 30–60 seconds while the server spins back up — this is expected, not a bug.

## Features

- Register and log in with persistent sessions (JWT access/refresh tokens via httpOnly cookies, with automatic silent token refresh)
- Upload videos with a thumbnail, title, and description
- Watch page with a video player, like button, subscribe button, and comments
- Channel pages with cover image, subscriber count, and tabs for videos and tweets
- Subscriptions feed, liked videos, and playlists (create, view)
- Twitter-style short text posts ("tweets") — create, edit, delete
- Creator dashboard with channel stats (subscribers, views, likes) and video management (publish/unpublish, delete)
- Responsive, dark-themed UI built with Tailwind CSS

## Tech stack

- **Framework:** React (with Vite)
- **Routing:** React Router
- **State management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **HTTP client:** Axios (with an interceptor for automatic token refresh)
- **Icons:** react-icons

## Getting started locally

### Prerequisites

- Node.js (v18+)
- The [backend](https://github.com/HPatil224/backend_project) running locally or deployed

### Setup

```bash
git clone https://github.com/HPatil224/videotube-frontend.git
cd videotube-frontend
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

(Point this at your deployed backend URL instead if you're not running the backend locally.)

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

This frontend is deployed on [Vercel](https://vercel.com), with `VITE_API_BASE_URL` set in the Vercel project's environment variables to point at the deployed backend on Render.

## Project structure

```
src/
├── api/           # axios instance and per-resource API calls
├── app/           # Redux store
├── components/    # reusable UI components (Navbar, Sidebar, cards, inputs, etc.)
├── features/      # Redux slices (auth, ui)
├── hooks/         # shared custom hooks
├── pages/         # route-level page components
├── utils/         # formatting helpers (views, dates, duration)
├── App.jsx        # route definitions
└── main.jsx       # app entry point
```

## License

ISC
