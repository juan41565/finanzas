# Design System Specification: Editorial Financial Intelligence

## 1. Overview & Creative North Star
**The Creative North Star: "The Architectural Ledger"**
This design system rejects the cluttered, "dashboard-in-a-box" aesthetic. Instead, it draws inspiration from high-end architectural blueprints and premium editorial finance journals. We move beyond generic layouts by embracing **intentional asymmetry** and **tonal depth**. 

The goal is to create an environment that feels authoritative yet breathable. We achieve this by replacing rigid structural lines with a sophisticated hierarchy of surfaces, allowing data to "float" within a structured, multi-dimensional space. The result is a high-trust digital experience that prioritizes clarity and executive-level polish.

---

## 2. Colors & Surface Philosophy
Our palette communicates stability through `primary` (#00346f) and prosperity through `secondary` (#006c47). However, the "premium" feel comes from how we treat the spaces between the data.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Definition must be achieved through background color shifts.
*   **Primary Layout:** Use `surface` (#f8f9fa) as the base canvas.
*   **Sectioning:** Use `surface_container_low` (#f3f4f5) to define large sidebar or navigation regions.
*   **Highlighting:** Use `surface_container_highest` (#e1e3e4) for subtle inset areas like search bars or inactive tabs.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (#f8f9fa)
*   **Mid-Level (Sections):** `surface_container` (#edeeef)
*   **Top-Level (Active Cards):** `surface_container_lowest` (#ffffff) – This creates a "lift" effect where the most important data feels closest to the user.

### The "Glass & Signature" Rule
*   **Glassmorphism:** For floating modals or dropdowns, use `surface_container_lowest` at 80% opacity with a `24px` backdrop blur. This ensures the financial context is never lost.
*   **Signature Gradients:** For primary Call-to-Actions (CTAs) or high-level growth metrics, apply a subtle linear gradient from `primary` (#00346f) to `primary_container` (#004a99) at a 135-degree angle. This adds "visual soul" and prevents the UI from feeling flat.

---

## 3. Typography
We utilize a dual-sans-serif pairing to balance editorial authority with functional precision.

*   **Display & Headlines (Manrope):** Chosen for its modern, geometric construction. Use `display-lg` to `headline-sm` for hero numbers (e.g., Total Net Worth) and section titles. The wide apertures of Manrope convey openness and transparency.
*   **Body & UI (Inter):** The industry standard for readability. Use `body-md` for data tables and `label-sm` for micro-copy. Inter’s tall x-height ensures financial figures remain legible even at small scales.

**Editorial Hierarchy Tip:** Use `headline-md` in `primary` (#00346f) for main page titles, but drop to `title-sm` in `on_surface_variant` (#424751) for secondary descriptions to create a clear "reading path."

---

## 4. Elevation & Depth
Depth is a functional tool for financial hierarchy, not a decorative flourish.

*   **The Layering Principle:** Avoid shadows for static cards. Instead, place a `surface_container_lowest` (#ffffff) card on a `surface_container` (#edeeef) background. This "Tonal Layering" feels more integrated and modern.
*   **Ambient Shadows:** For interactive "floating" elements (e.g., a draggable budget module), use a shadow: `y-offset: 8px, blur: 24px, color: rgba(25, 28, 29, 0.06)`. Note the use of `on_surface` for the shadow tint to maintain natural lighting.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in data-heavy tables, use `outline_variant` (#c2c6d3) at **15% opacity**. High-contrast lines are the enemy of a premium feel.

---

## 5. Components

### Financial Metric Cards
*   **Styling:** No borders. Background: `surface_container_lowest`. Corner Radius: `xl` (0.75rem).
*   **Content:** Large `display-sm` value for the metric. Use `secondary` (#006c47) for positive growth indicators and `error` (#ba1a1a) for negative.
*   **Spacing:** Use `spacing-6` (1.5rem) internal padding to provide "luxury" white space.

### Data Tables & Lists
*   **The No-Divider Rule:** Forbid 1px dividers between rows. Use `spacing-2` (0.5rem) of vertical white space and a `surface_container_low` hover state to separate entries.
*   **Header:** `label-md` in `outline` (#737783), all-caps with `0.05em` letter spacing for an editorial look.

### Buttons
*   **Primary:** `primary` (#00346f) fill with `on_primary` (#ffffff) text. Corner Radius: `md` (0.375rem).
*   **Secondary:** `surface_container_high` (#e7e8e9) fill. No border.
*   **Tertiary/Ghost:** No fill. `primary` text. Use for low-emphasis actions like "Export" or "View All."

### Elegant Chart Styles
*   **Visuals:** Use `surface_tint` (#255dad) for primary data sets. Use `secondary_fixed` (#8df7c1) for "Goal" or "Target" overlays.
*   **Interactivity:** Tooltips must use the Glassmorphism rule (backdrop blur) to feel like a premium overlay.

---

## 6. Do's and Don'ts

### Do
*   **DO** use white space as a structural element. If a layout feels "off," add `spacing-8` instead of a line.
*   **DO** align data-heavy columns (currency) to the right to ensure decimal points align.
*   **DO** use `tertiary_container` for "Neutral" status chips—it provides a sophisticated slate-blue that feels more professional than mid-gray.

### Don't
*   **DON'T** use 100% black (#000000). Always use `on_background` (#191c1d) for text to maintain a soft, high-end feel.
*   **DON'T** use the `full` (9999px) roundedness for buttons; keep them `md` to maintain an "Architectural" and professional rigor. Save `full` circles for profile avatars only.
*   **DON'T** use vibrant, "neon" greens. Stick to `secondary` (#006c47) to ensure the palette feels "Old Money" and trustworthy.