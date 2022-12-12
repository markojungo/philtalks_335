# Philtalks 335
CMSC335 Final Project

## About
We use Vue.js for the frontend (`/client`). Vuetify is used for prepackaged Vue components that look nice. Vite is used to run the development server.

The server uses Express.js and can be found in `/server`.

## Getting Started
```sh
cd client
npm install
cd ../server
npm install
cd ../
cp .env.sample .env
```
Fill out `.env` file. Then, open two terminals.
```sh
npm run client
npm run server
```
This will run the client frontend (Vue/Vuetify/Vite) and also server backend (Express).