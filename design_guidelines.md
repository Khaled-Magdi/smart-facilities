# Design Guidelines: Smart Facilities Operations Management System

## Design Approach

**Selected System:** Carbon Design System (IBM) with Material Design influences
**Rationale:** Enterprise-grade data management requiring robust component structure, excellent RTL support, and professional aesthetic suitable for facilities management workflows.

## Core Design Principles

1. **Information Hierarchy First:** Clear data organization with consistent visual weight
2. **Workflow Clarity:** Each stage of facility management visually distinct
3. **Bilingual Excellence:** Seamless Arabic/RTL and English/LTR experiences
4. **Density with Breathing Room:** Data-rich but not overwhelming

---

## Typography

**Arabic Font Stack:**
- Primary: IBM Plex Sans Arabic (via Google Fonts)
- Fallback: Cairo, system-ui

**English Font Stack:**
- Primary: IBM Plex Sans
- Fallback: Inter, system-ui

**Hierarchy:**
- Page Titles: 2xl (32px) - font-bold
- Section Headers: xl (24px) - font-semibold  
- Card Titles: lg (20px) - font-semibold
- Body Text: base (16px) - font-normal
- Labels/Metadata: sm (14px) - font-medium
- Captions: xs (12px) - font-normal

---

## Layout System

**Spacing Units:** Consistent use of Tailwind units: 2, 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Page margins: Container with px-6 lg:px-8

**Grid Strategy:**
- Dashboard KPIs: 1/2/4 column grid (mobile/tablet/desktop)
- Data tables: Full-width with horizontal scroll on mobile
- Forms: Single column mobile, 2-column desktop for related fields
- Facility tabs/windows: Stacked mobile, side navigation desktop

---

## Component Library

### Navigation
- **Top Bar:** Fixed header with logo (left/right based on locale), breadcrumbs, language toggle, theme toggle, user menu
- **Sidebar:** Collapsible with icons + labels, active state with accent border-left (LTR) or border-right (RTL)
- **Breadcrumbs:** Essential for deep navigation (Dashboard → Facilities → Facility Name → Phase)

### Dashboard Components
- **KPI Cards:** Large numbers (text-3xl font-bold), trend indicators with icons, subtle background gradients
- **Charts:** Use Chart.js or Recharts - bar charts for phases, pie charts for facility types, line charts for costs over time
- **Status Indicators:** Color-coded badges (success/warning/danger with text labels for accessibility)
- **Quick Actions:** Prominent "+ Add Facility" button (primary CTA) in top-right (LTR) or top-left (RTL)

### Data Tables
- **Structure:** Sticky header, zebra striping, hover states, sortable columns with icons
- **Actions:** Row-level actions as icon buttons (view/edit/delete), bulk actions in header
- **Pagination:** Bottom-aligned with items-per-page selector
- **Search/Filter:** Top bar with multi-parameter filtering, clear visual feedback for active filters

### Facility Detail Pages
- **Header Section:** Facility name (text-2xl), status badge, progress bar (0-100%), key metrics in compact cards
- **Tab/Window System:** Horizontal tabs on desktop, dropdown selector on mobile
- **Phase Sections:** 
  - Clear step numbering (1️⃣, 2️⃣, etc.)
  - Completion checkmarks
  - Expandable accordions for historical data
  - Upload areas with drag-drop zones and preview thumbnails

### Forms
- **Input Fields:** 
  - Full-width with clear labels above
  - Required field indicators (*)
  - Inline validation with icons and helper text
  - Date/time pickers with calendar overlays
  - File upload with progress bars

- **Multi-step Forms:** 
  - Stepper indicator at top
  - Previous/Next navigation
  - Save draft capability

### Master Data Management
- **List View:** Compact table with inline editing capability
- **Add/Edit Modal:** Centered overlay with form fields, clear save/cancel actions
- **Drag-to-reorder:** Visual drag handles for sorting items

### Alerts & Notifications
- **Toast Messages:** Top-right (LTR) / top-left (RTL), auto-dismiss with progress bar
- **Alert Banners:** Full-width at page top for critical system messages
- **Inline Alerts:** Within forms/sections for contextual warnings

---

## Dark Mode Strategy

**Light Mode (Default):**
- Background: Neutral-50
- Cards/Surfaces: White with subtle shadow
- Text: Gray-900 (primary), Gray-600 (secondary)
- Borders: Gray-200

**Dark Mode:**
- Background: Gray-900
- Cards/Surfaces: Gray-800 with subtle highlight
- Text: Gray-50 (primary), Gray-400 (secondary)
- Borders: Gray-700

**Accent Colors:** 
- Primary: Blue-600 (light) / Blue-400 (dark)
- Success: Green-600 / Green-400
- Warning: Amber-600 / Amber-400
- Danger: Red-600 / Red-400

---

## RTL/LTR Considerations

- All spacing/margins mirror automatically with `dir="rtl"`
- Icons always leading edge of text labels
- Navigation sidebar flips to opposite side
- Form fields and tables maintain logical reading order
- Date formats adjust per locale (DD/MM/YYYY vs MM/DD/YYYY)

---

## Images

**Dashboard:** No hero image - data-first interface
**Login Page:** Abstract geometric pattern or facility management illustration (optional background)
**Empty States:** Illustrations for "No facilities yet", "No inventory items", etc.
**Facility Photos:** User-uploaded images in visit/installation phases - display as galleries with lightbox
**Icons:** Material Icons via CDN for consistency across all UI elements

---

## Animations

**Minimal and Purposeful:**
- Sidebar collapse/expand: 200ms ease
- Tab switching: Fade transition 150ms
- Modal open/close: Scale + fade 200ms
- No scroll-based animations
- Loading spinners for async operations

---

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (2-column grids, collapsible sidebar)
- Desktop: > 1024px (full multi-column, persistent sidebar)