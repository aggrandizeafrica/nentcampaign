# Nairobi ENT Clinic: Holiday Speech Therapy Campaign

A one-page landing page for Nairobi ENT Clinic's December holiday speech therapy campaign, with a booking form. It uses static HTML, CSS and JS, with no build step.

## Files

| File | Purpose |
|---|---|
| `campaign.html` | Page content and booking form |
| `styles.css` | Styles (Calm-inspired night-sky look, navy + gold) |
| `config.js` | **Edit this:** booking endpoint and optional WhatsApp number |
| `main.js` | Form validation and submission |

## Before going live

1. **Connect the form.** In `config.js`, set `bookingEndpoint` to a form service URL (e.g. create a form on [Formspree](https://formspree.io) and paste its `https://formspree.io/f/xxxx` URL). Until then the form runs in demo mode and sends nothing.
2. **Optional WhatsApp hand-off.** Set `whatsappNumber` (e.g. `254721391465`) to show a "Send on WhatsApp" button with the booking pre-filled.
3. **Holiday offer.** Replace `[OFFER, e.g. holiday assessment rate, valid until DATE]` in `campaign.html`.
4. **Logo.** Replace the "ENT" badge in the header with the clinic's logo.
5. **Check the copy.** "Our team calls to confirm within one working day" should match what the clinic can commit to.

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from `main`, root; the page is at `/campaign.html`), Netlify, Vercel or the clinic's own server.
