# ShopKart

A full-stack e-commerce storefront built with the MERN stack (MongoDB, Express, React, Node.js).
Customers can register, browse products, save a wishlist, manage a cart, pay with Razorpay and track their orders.

## Features

- **Accounts:** register, log in and out, view profile, change password (JWT in an HTTP-only cookie)
- **Catalogue:** product listing with category filters, search and sorting, plus product detail pages with related items
- **Wishlist:** save and remove products
- **Cart:** add, change quantity, remove, with stock checks
- **Checkout and orders:** shipping address form, Razorpay payment with server-side signature verification, order history and order details
- **Storefront UI:** responsive layout, transparent header over a video hero, mobile menu drawer, footer with newsletter and info pages

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios, Create React App |
| Backend | Node.js, Express 5, Mongoose 8 |
| Database | MongoDB (local or MongoDB Atlas) |
| Auth | JSON Web Tokens in an HTTP-only cookie, bcrypt password hashing |
| Payments | Razorpay |

## Project structure

```
.
├── backend/
│   ├── config/          Razorpay client
│   ├── controllers/     Request handlers
│   ├── middlewares/     Auth and CORS
│   ├── models/          Mongoose models (customer, product, order)
│   ├── routes/          Express routers
│   ├── utils/           Token helper and product seed script
│   └── index.js         Server entry point
└── frontend/
    ├── public/          Static files, including the hero video
    └── src/
        ├── components/  Navbar, Footer, ProductCard, ...
        ├── context/     Cart state
        ├── pages/       One file per route
        └── services/    API client (Axios)
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A MongoDB database: a local install, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Razorpay](https://razorpay.com/) account for API keys (test keys are fine)

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/riturajcodes/shopkart-webdev-lab.git
cd shopkart-webdev-lab

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure the backend

Copy the example file and fill it in:

```bash
cd backend
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | yes | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/shopkart` or your Atlas URI |
| `JWT_SECRET` | yes | Long random string used to sign login tokens. Generate one with `openssl rand -hex 32` |
| `RAZORPAY_KEY_ID` | yes | From the Razorpay dashboard (Settings, then API Keys). Use a `rzp_test_...` key while developing |
| `RAZORPAY_KEY_SECRET` | yes | The matching secret |
| `PORT` | no | Port the API listens on. Defaults to `5000` |
| `NODE_ENV` | no | `development` locally, `production` when deployed |
| `CLIENT_URL` | no | Allowed frontend origin(s) for CORS, comma-separated. If unset, any origin is accepted |

The server refuses to start if `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` is missing.

### 3. Configure the frontend (optional)

The frontend calls `http://localhost:5000` by default, so no setup is needed for local development.
To point it somewhere else, create `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

Values starting with `REACT_APP_` are compiled into the build, so restart `npm start` after changing them, and never put secrets in them.

### 4. Seed the products (first run)

```bash
cd backend
npm run seed:products
```

> **Warning:** the seed script deletes every existing product before inserting the sample catalogue. Do not run it against a database whose products you want to keep.

### 5. Run the app

In two terminals:

```bash
# Terminal 1: API on http://localhost:5000
cd backend
npm run dev        # nodemon, restarts on changes
# or: npm start
```

```bash
# Terminal 2: React app on http://localhost:3000
cd frontend
npm start
```

Open http://localhost:3000. The API health check is at http://localhost:5000/health.

### Testing payments

With `rzp_test_...` keys, Razorpay's checkout runs in test mode and no real money moves.
Use the test card and UPI details from the [Razorpay test payments guide](https://razorpay.com/docs/payments/payments/test-card-details/).

## Scripts

**Backend** (`backend/`)

| Command | What it does |
|---|---|
| `npm start` | Start the API with Node |
| `npm run dev` | Start the API with nodemon |
| `npm run seed:products` | Replace all products with the sample catalogue |

**Frontend** (`frontend/`)

| Command | What it does |
|---|---|
| `npm start` | Dev server with hot reload |
| `npm run build` | Production build into `frontend/build` |
| `npm test` | Run tests |

## API overview

All routes return JSON. Routes marked "auth" need the login cookie.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/customers/register` | | Create an account |
| POST | `/customers/login` | | Log in and set the auth cookie |
| GET | `/customers/me` | yes | Current user |
| POST | `/customers/logout` | yes | Clear the auth cookie |
| PATCH | `/customers/change-password` | yes | Change password |
| GET | `/products` | | List products (`?search=` and `?category=`) |
| GET | `/products/:id` | | One product |
| GET | `/wishlist` | yes | List wishlist |
| POST / DELETE | `/wishlist/:productId` | yes | Add or remove a product |
| GET | `/cart` | yes | Get cart |
| POST / PATCH / DELETE | `/cart/:productId` | yes | Add, change quantity, or remove |
| POST | `/orders/create-payment-order` | yes | Create an order and a Razorpay payment order |
| POST | `/orders/verify-payment` | yes | Verify the payment signature |
| GET | `/orders` | yes | Order history |
| GET | `/orders/:id` | yes | One order |
| GET | `/health` | | Health check |

## Deployment

The repo holds two apps, so deploy them as two services. These steps use [Render](https://render.com/), but any host works.

### Backend: Web Service

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Environment variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | A new random secret (not your development one) |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `CLIENT_URL` | Your frontend's URL, e.g. `https://shopkart.onrender.com` |

Do not set `PORT`: the host provides it.
In Atlas, open Network Access and allow the host's IPs (or `0.0.0.0/0`), otherwise the API cannot reach the database.

### Frontend: Static Site

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `build` |

- Set `REACT_APP_API_URL` to the backend's URL **before** building (it is baked in at build time).
- Add a rewrite rule from `/*` to `/index.html`, otherwise refreshing on a page like `/products` returns 404.

### Cookies and CORS in production

When `NODE_ENV=production` the login cookie is `Secure; SameSite=None`, so a frontend and API on different domains can share a login. This needs HTTPS on both.
Some browsers (Safari, Brave, Firefox strict mode, Chrome Incognito) block cross-site cookies regardless. If login only fails there, serve both from subdomains of one domain, for example `app.example.com` and `api.example.com`.

## Troubleshooting

| Problem | Likely cause |
|---|---|
| API exits with `Missing required env vars` | One of the four required variables is not set in `backend/.env` |
| `MongooseServerSelectionError` | Wrong `MONGO_URI`, or Atlas is blocking your IP |
| Products page is empty | Run `npm run seed:products` |
| Login works locally but not when deployed | Check `NODE_ENV=production` on the API, HTTPS on both services, and `REACT_APP_API_URL` on the frontend |
| Browser console shows a CORS error | `CLIENT_URL` does not exactly match the frontend's origin (scheme and host, no path) |
| Checkout fails when starting a payment | The Razorpay keys are invalid, or you mixed a test key ID with a live secret (or the reverse) |
| Changed `REACT_APP_API_URL` but nothing happened | Restart `npm start` or rebuild: it is read at build time |

## Notes

- Product images in the seed data and the landing page come from Unsplash.
- The footer links (shipping, returns, privacy and so on) point to placeholder pages in `frontend/src/pages/InfoPage.jsx`. Replace that text with your real policies.
- The newsletter form in the footer is front-end only and does not store emails.
