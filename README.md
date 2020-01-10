# Property-Fuse
A simple real estate listing/lead management platform for investment properties. Utilizes services from Google (Maps, DistanceMatrix, Firestore), OpenStreetMaps (maps, zipcode geolocation), and OAuth (Google, Facebook). It also features a simple payment processing system (currently utilizing Stripe for secure payments), that can easily be extended to support virtually any payment processor.

### Backend
The backend is based on ExpressJS running on Node. The server provides the front-end application (in `./app/`) to the user, and acts as a RESTful API. Authentication is done utilizing PassportJS for social sign-in, and features a simple role-based authorization layer. The database is primarily MongoDB (via mongoose), but can be swapped out for any storage system. Images (for listings and user avatars) is based on Google's Firestore service.

### Frontend
The frontend is a react SPA utilizing Redux for state management. It connects to the backend via custom services set on a per-resource basis (user, listing, etc.) It was originally developed via create-react-app to expedite development and help minimize scaffolding and setup. 
