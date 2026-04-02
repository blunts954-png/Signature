# Project Roadmap: Signature Digital Showroom

This roadmap outlines the transformation of Signature from a static business site into an "Expensive" AI-driven digital showroom.

## 1. Sitemap & User Journey

### [Home] — The Entrance
* **Hero**: HD slow-motion drone footage with a "glassmorphism" overlay.
* **AI Personalization Bar**: A subtle input area: *"Describe your dream space..."*
* **Project Mosaic**: Dynamic sections that prioritize context (e.g., Residential if they've browsed housing).

### [Vision] — The Signature Vision Tool
* **Interactive Tool**: Clients upload a photo; the tool overlays "Signature-grade" finishing (AI-simulated with high-quality PNG overlays and filter logic).
* **Instant Value**: Provides a "Style Score" for the current space.

### [Vault] — The Client Portal
* **Transparency**: A dashboard showing AI-sorted progress: "85% complete," "Integrity Check: Pass."
* **Logistics**: Automated sorting of receipts and photos using AI-assisted metadata.

### [Concierge] — Interactive Intake
* **The Concierge**: A full-screen, elegant conversational interface that replaces standard forms.
* **Drafting**: It generates a preliminary "Project Blueprint" for Brandon’s review in real-time.

---

## 2. Technical Brief

### Brand Identity & Typography
* **Primary (Headings)**: `Cormorant Garamond` (The "Vogue" effect).
* **Secondary (Body)**: `Montserrat` (Ultra-light for a clean, modern look).
* **Colors**: 
  - **Rich Black**: `#050505`
  - **Champagne Gold**: `#C5A059`
  - **Platinum White**: `#F5F5F7`

### Technical Stack
* **Build Engine**: Vite (for maximum performance).
* **Animations**: GSAP (GreenSock) for high-fidelity reveal and scroll effects.
* **Layout**: CSS Grid + Flexbox with an emphasis on "Luxury Margin" (plentiful whitespace).
* **Intelligence**: 
  - **Personalization**: `localStorage` to track visitor intent (Residential vs. Commercial).
  - **Vision Engine**: Canvas API hooks for the overlay experience.
  - **Concierge**: Logic-tree based conversational UI with hooks for future AI API integration.

### Core Interactions
1. **The Scroll Reveal**: As the user scrolls, elements don't pop; they glide into view with a 1.2s ease-out curve.
2. **Personalized Feed**: The site remembers three subsequent clicks and adapts the home page layout.
3. **Immersive Walkthrough**: A custom implementation for 360-degree viewing of finished "Signature" projects.

---

## 3. Implementation Phases
* **Phase 1**: Base UI & "Vogue" Typography Overhaul.
* **Phase 2**: Navigation & Immersive Hero.
* **Phase 3**: AI Personalization Engine.
* **Phase 4**: Signature Vision & AI Concierge Tool.
