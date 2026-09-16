# Arkay Software Solutions Limited — Website

A professional, static marketing website for **Arkay Software Solutions Limited**, a
software development and consulting firm serving banking, financial services and the
government sector, and building its own enterprise software products.

Built with plain **HTML, CSS and JavaScript** — no build step, no dependencies.

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, services overview, industries, stats, products teaser, testimonials |
| About | `about.html` | Story, mission & vision, values, leadership team |
| Services | `services.html` | Capabilities, banking & government focus, process, FAQ |
| Products | `products.html` | ArkPay, GovConnect, RiskLens product showcases |
| Contact | `contact.html` | Contact details and validated enquiry form |

## Structure

```
arkaysoft/
├── index.html
├── about.html
├── services.html
├── products.html
├── contact.html
├── css/
│   └── styles.css      # Full design system + responsive rules
├── js/
│   └── main.js         # Nav, scroll reveal, counters, FAQ, form validation
├── assets/
│   └── favicon.svg
└── README.md
```

## Features

- Responsive, mobile-first layout (down to 360px) with an accessible mobile menu
- Sticky header, animated stat counters and scroll-reveal effects
- Accordion FAQ and client-side contact-form validation
- Accessible markup (ARIA labels, semantic landmarks), `prefers-reduced-motion` support
- Cohesive navy + teal design system tuned for regulated industries

## Running locally

No build required. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Notes

- Photography is loaded from Unsplash CDN URLs; swap them for licensed brand imagery
  before production use.
- The contact form is front-end only (it simulates success). Wire the `submit` handler
  in `js/main.js` to your backend, email service or a form provider to receive enquiries.
- All company details (address, phone, email, product names) are placeholders — replace
  them with real information.
