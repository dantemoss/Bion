# MyBento Roadmap

## 1. ✅ Phase 1: MVP (Completed)
- [x] Project Setup (Next.js + Supabase + Tailwind)
- [x] Authentication (Login/Signup)
- [x] Database Schema (Profiles, Blocks)
- [x] Admin Dashboard (View blocks)
- [x] Create Block Feature (Modal)
- [x] Public Profile Page (`/[username]`)
- [x] Profile Settings (Upload Avatar/Change Name)
- [x] Basic Analytics (Click counter)
- [x] Deployment (Vercel)

## 2. ✅ Phase 2: UX Improvements (Completed)
- [x] **Delete Block:** Add capability to delete a block.
- [x] **Edit Block:** Allow editing title/url of existing blocks.
- [x] **Toast Notifications:** Add feedback (Success/Error messages) using `sonner` or `toast`.
- [x] **Drag & Drop:** Reorder blocks visually.
- [x] **Loading States:** Disable buttons while submitting to prevent double clicks.

## 3. 🚀 Phase 3: Growth Features
- [x] **Security & Validation:** Input sanitization, password policies, error handling.
- [x] **Social Login:** Google Auth.
- [x] **Onboarding:** Username selection flow for new users.
- [ ] **SEO:** OpenGraph tags for public profiles.

### 3.1 Better Analytics (Log-based System)
- [ ] **Database Schema Shift:** Create `events` table in Supabase for log-based analytics. Fields: `id`, `block_id`, `created_at`, `browser`, `device_type`, `os`, `country` (optional).
- [ ] **Data Capture:** Update `incrementClick` Server Action to insert into `events` table, parsing User-Agent headers to detect device/browser.
- [ ] **Data Aggregation:** Create backend functions to aggregate data by date (last 7/30 days) and by device type for charts.
- [ ] **Dashboard UI:** Implement `recharts` library. Create visual components in `/admin`:
  - [ ] Line Chart: Clicks history over time.
  - [ ] Pie Chart: Device/OS distribution.
  - [ ] Top Links: List of best performing links.

---

## 4. 🎨 Phase 4: Customization (Personalization System)

### 4.1 Temas Básicos (Foundation)
- [ ] **Color Scheme:** Background color, text color, accent colors (primary/secondary).
- [ ] **Basic Backgrounds:** Solid colors, predefined gradients.
- [ ] **Button Styles:** Rounded, square, pill, outline, solid variants.

### 4.2 Tipografía y Layout
- [ ] **Font Selector:** Google Fonts integration (curated selection: Inter, Poppins, Roboto, etc.).
- [ ] **Layout Options:** List view, grid view, bento-style layout.
- [ ] **Spacing:** Compact, normal, spacious modes.

### 4.3 Fondos Avanzados
- [ ] **Image Backgrounds:** Upload custom background images.
- [ ] **Video Backgrounds:** Support for video backgrounds with fallback.
- [ ] **Pattern Backgrounds:** SVG patterns and textures.

### 4.4 Componentes Personalizables
- [ ] **Icon Selector:** Choose icons per block (Lucide, custom upload).
- [ ] **Custom Banners:** Header banner with custom image.
- [ ] **Advanced Buttons:** Shadows, borders, hover animations.
- [ ] **Block Styles:** Individual styling per block type.

### 4.5 Temas Predefinidos
- [ ] **Theme Presets:** Ready-to-use themes (Dark, Light, Neon, Minimal, etc.).
- [ ] **Theme Import/Export:** Share themes between users.

---

## 5. 📊 Phase 5: Analytics & Insights
- [ ] **Click Analytics:** Detailed click tracking per block.
- [ ] **Visitor Stats:** Unique visitors, page views, referrers.
- [ ] **Time-based Charts:** Daily/weekly/monthly analytics.
- [ ] **Geographic Data:** Visitor locations (country/city).

---

## 6. 🔮 Future Ideas
- [ ] **Custom Domains:** Connect personal domains.
- [ ] **QR Code Generator:** Generate QR for profile.
- [ ] **Scheduled Links:** Show/hide links by date.
- [ ] **Password Protected Links:** Private links with password.
- [ ] **Email Collection:** Capture visitor emails.
- [ ] **Integrations:** Spotify, YouTube, Instagram embeds.