Auction House (Vanilla JS)

Frontend web application for the Noroff Auction API.
Built with Vanilla JS + Bootstrap (no frameworks).

✨ Features

Authentication: Register & Login with @stud.noroff.no

Profile: Avatar, credits, my listings, my bids

Listings: Browse all, search, view single listing, bid

Create/Edit/Delete listings (logged-in users only)

Responsive UI: Desktop & mobile layouts (Figma design followed)

Credits pill in header when logged in

🔗 Routes

Hash-based routing:

#/listings → Dashboard (all listings, public)

#/listing/:id → Single listing with bids

#/login → Sign In

#/register → Sign Up

#/create → New listing

#/edit/:id → Edit listing

#/profile → My profile

👤 Profile Page

Shows avatar, name, email, credits

Update avatar URL (auto updates header + profile)

My Listings with Open/Edit links

My Bids with amount + title

📦 Listings

Publicly browseable (no login required)

Cards show image, title, description, countdown, current bid

Search bar filters by keyword

Single listing page shows bid history and form to place new bid

➕ Create & Edit Listings

Logged-in users can create a new listing with:

Title, description, image URL(s), deadline

Edit or delete your own listings

Server validation ensures deadline is future and bid rules are respected

🔐 Auth (Noroff API v2)

POST /auth/register – register (email must end with @stud.noroff.no)

POST /auth/login – login

POST /auth/create-api-key – API key created after login

All protected requests include Authorization: Bearer + X-Noroff-API-Key

🛠 Run

Use any static server, e.g. VS Code Live Server:

npm install -g live-server
live-server


Open index.html in browser.

🚀 Deploy

Host on Netlify, Vercel, or GitHub Pages. It’s a static site — no server needed.

⚙️ Configure

API base URL is set in js/utils/api.js → BASE_URL.
Defaults to:

https://v2.api.noroff.dev

