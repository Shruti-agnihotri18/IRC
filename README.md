# IRC – Indian Relief Connect (Frontend)

A React frontend for a flood & disaster relief coordination platform. Citizens can submit help requests, and NGOs/volunteers can manage and assist them.

## Tech Stack
- React 18 (functional components + hooks)
- react-router-dom v6 (routing)
- axios (HTTP)
- leaflet + react-leaflet (maps)

## Quick Start

1. Create the environment file:

```
cp .env.example .env
```

Edit `.env` and set:

```
REACT_APP_API_BASE_URL=http://localhost:4000
```

2. Install dependencies:

```
npm install
```

3. Run the app:

```
npm start
```

The app runs at `http://localhost:3000`.

## Environment
- `REACT_APP_API_BASE_URL`: Base URL to your backend (e.g., `http://localhost:4000`).

## API Contract (Backend Requirements)
All HTTP calls are centralized in `src/services/api.js` and use `REACT_APP_API_BASE_URL`.

- Get Active Alerts – GET `/api/alerts`
  - Response: `[{ id, title, message, riskLevel: 'high'|'medium'|'low' }]`
- Get All Help Requests – GET `/api/requests`
  - Response: `[{ id, helpType, details, status: 'urgent'|'moderate'|'served', peopleCount, location: { lat, lng }, locationName }]`
- Create a New Help Request – POST `/api/requests`
  - Body example:
    ```json
    {
      "name": "Rohit",
      "helpType": "Rescue",
      "peopleCount": 4,
      "details": "Elderly person and a child",
      "locationName": "Near Civil Hospital, Surat",
      "location": { "lat": 21.1702, "lng": 72.8311 }
    }
    ```
  - Success response: `{ "message": "Your request has been submitted. Help is on the way." }`
- Update a Help Request Status – PUT `/api/requests/:id`
  - Body example: `{ "status": "served" }`
  - Success response: `{ "message": "Request req-b7d2 has been marked as served." }`

## Project Structure
```
src/
  components/
    AlertBanner.js
    AlertBanner.css
    InteractiveMap.js
    InteractiveMap.css
    Navbar.js
    Navbar.css
    RequestCard.js
    RequestCard.css
  pages/
    CitizenPage.js
    HomePage.js
    NgoPage.js
  services/
    api.js
  utils/
    utils.js
  App.js
  index.css
  index.js
```

## Notes
- Map pins are color-coded by request status: red=urgent, orange=moderate, green=served.
- NGO dashboard polls requests every 30s and allows marking a request as assisted.
- Citizen form supports auto-detecting geolocation and manual coordinate entry.
