IRC – IndianReliefConnect

Monorepo scaffold for Smart India Hackathon.

Structure
- backend/: placeholder (Express + MongoDB to be added later)
- frontend/: Vite + React app (Tailwind, shadcn-style UI, Framer Motion, React-Leaflet, R3F)

Quickstart (frontend)
1) cd frontend
2) npm install
3) cp .env.example .env and set VITE_API_BASE_URL (e.g., http://localhost:5000)
4) npm run dev

Notes
- Map: OpenStreetMap tiles, no Google billing
- API: Reads base URL from VITE_API_BASE_URL
- Pages: Landing (3D globe), Dashboard (map, forms, allocations)
