# One Support Disability — Website

A responsive, accessible marketing website for **One Support Disability**, a registered NDIS provider in Melbourne.

Built as a static site (plain HTML, CSS and vanilla JavaScript — no build step). Brand colours are sampled from the official logo: navy `#143852`, blue `#02A1DF`, green `#58B929`.

## Pages
Home · About · Services (overview + Daily Living, Supported Independent Living, Community Participation, Transport) · NDIS Info · Make a Referral · Careers · Contact · Accessibility · Privacy.

## Run locally
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes
- Header & footer are shared and injected from `assets/js/main.js` (edit the `NAV` array and the `SITE` contact details there to update site-wide).
- Forms are front-end only (demo) — connect to your email or a service like Formspree to go live.
- Phone, ABN and email are live; no street address is shown (none provided).
