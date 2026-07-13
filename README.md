# Premium Developer Portfolio

A world-class, premium, and highly interactive developer portfolio built for **Dipesh Jangir** (Full Stack Web Developer). The interface combines the elegant design languages of **Apple, Linear, Vercel, and Aceternity UI** to create a luxurious and responsive developer showcase.

## 🚀 Tech Stack

* **Core**: React 19, Vite (bundling), React Router DOM (client routes and 404 handling)
* **Styling**: Tailwind CSS v4 (with native compiler plugin configurations)
* **Animations**: Framer Motion (powering loading counters, custom cursor trails, magnetic pull grids, and accordions)
* **Icons**: Lucide React Icons & custom optimized inline brand SVGs
* **Forms**: Client-side EmailJS integration (eliminating server requirements)

---

## 🎨 Key Features

1. **Progressive Preloader**: Dynamic typing states and percentage counter before site reveal.
2. **Custom Cursor Glow**: Aceternity-inspired dual-element glowing cursor that snaps and scales on hover over links/buttons.
3. **Animated Grid Canvas**: Vercel-style radial mesh background with organic gradient blobs drifting behind content.
4. **Scroll Telemetry**: Top-aligned scroll depth tracker and a floating scroll-to-top shortcut.
5. **Interactive Project Panel**: Interactive project grid with category filters, technology badges, and collapsible highlight sections.
6. **Custom 404 Route**: Dedicated error page with animated graphics and fallback routing.
7. **EmailJS Form Handler**: Client-side email dispatch with instant submission states.

---

## 📂 Modern Folder Structure

```
C:\Users\Dipesh\OneDrive\Desktop\developer-portfolio/
├── public/                     # Static root directory
│   ├── Resume_Dipesh_Jangir.pdf # Resume PDF placeholder
│   └── favicon.svg             # Favicon asset
├── src/
│   ├── assets/                 # Profile photos and screenshots
│   │   └── profile.jpg         # Profile picture placeholder
│   ├── components/             # Reusable atomic UI elements
│   │   ├── CustomCursor.jsx    # Custom glowing cursor trail
│   │   ├── MagneticButton.jsx   # Magnetic pull buttons
│   │   ├── BackgroundGrid.jsx  # Animated grids and blobs
│   │   ├── LoadingScreen.jsx   # Counting loading overlay
│   │   ├── ScrollProgress.jsx  # Reading depth bar
│   │   ├── ScrollToTop.jsx     # Back to top floating button
│   │   ├── Accordion.jsx       # FAQ collapse component
│   │   └── SocialIcons.jsx     # Custom SVG brand assets
│   ├── data/                   # Structured static data files
│   │   ├── projects.js         # Core projects database
│   │   ├── skills.js           # Tech skills categorization
│   │   ├── faq.js              # Frequently asked questions
│   │   └── process.js          # Dev workflow timeline stages
│   ├── hooks/                  # Custom utility hooks
│   │   └── useMousePosition.js # Mouse tracking coordinates
│   ├── sections/               # Layout components
│   │   ├── Hero.jsx            # Landing hero with CTAs
│   │   ├── About.jsx           # Narrative bio and maps
│   │   ├── WhyWorkWithMe.jsx   # Values cards grid
│   │   ├── Skills.jsx          # Skills grid indicators
│   │   ├── FeaturedTechnologies.jsx # Secondary core stack panel
│   │   ├── Services.jsx        # Services offered
│   │   ├── DevProcess.jsx      # Step lifecycle timeline
│   │   ├── Projects.jsx        # Projects panel with filters
│   │   ├── FAQ.jsx             # Accordion list
│   │   ├── Contact.jsx         # EmailJS submission form
│   │   └── Footer.jsx          # Minimal branding and copyrights
│   ├── index.css               # Tailwind directives and theme variables
│   ├── main.jsx                # StrictMode entry loader
│   └── App.jsx                 # Routing configuration coordinator
├── index.html                  # Core viewport and SEO meta tags
├── vite.config.js              # Bundler configs for React and Tailwind CSS v4
├── package.json                # Project dependencies and runs
└── .gitignore                  # Git tracking exclusions
```

---

## ⚡ Setup & Installation

### 1. Clone & Install
Clone the repository and install all node packages:
```bash
git clone https://github.com/dipeshjaengir/Portfolio.git
cd Portfolio
npm install
```

### 2. Configure Environment variables
Create a `.env` file in the root directory to set up EmailJS credentials for the contact form:
```env
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 3. Run Dev Server
Launch the local dev server:
```bash
npm run dev
```

### 4. Build for Production
Verify compilation and generate production assets inside `dist/`:
```bash
npm run build
```

---

## 📸 Placeholders to Replace

To personalize the portfolio, replace the following placeholder items:
* **Profile Image**: Replace `src/assets/profile.jpg` with your final professional portrait.
* **Resume**: Replace `public/Resume_Dipesh_Jangir.pdf` with your actual CV/Resume PDF.
* **Project Screenshots**: Save your mockups under `src/assets/projects/` with filenames matching the project IDs to automatically render screenshots:
  * `shree-g-mart.jpg`
  * `resumepro-ai.jpg`
  * `smart-recruitment-portal.jpg`
  * `gym-management-saas.jpg`
  * `restaurant-website.jpg`
  * `mediconnect.jpg`
  *(If screenshots are missing, cards will automatically fall back to styled glassmorphic visual gradient layers.)*
