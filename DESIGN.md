# TailAdmin-Inspired Dashboard Design System

This document defines a detailed design specification for recreating a dashboard interface visually aligned with the TailAdmin React demo shown in the provided screenshot and live reference website. Use it as an implementation guide for an AI coding agent, frontend developer, or UI designer.

The design style is a clean, modern, data-rich SaaS/admin dashboard with a light neutral canvas, soft blue brand accents, rounded cards, thin borders, calm spacing, and readable analytics components.

---

## 1. Design Direction

### Overall Visual Identity

The interface should feel:

- Modern and professional
- Clean, spacious, and highly readable
- SaaS-oriented and dashboard-focused
- Minimal, but not empty
- Soft and calm, with low visual noise
- Enterprise-friendly and recruiter/client-friendly
- Optimized for data visualization, metrics, tables, forms, and admin workflows

### Core UI Personality

The UI uses a **soft admin dashboard aesthetic**:

- White cards on a very light gray background
- Subtle gray borders instead of heavy shadows
- Blue as the primary action/accent color
- Green and red only for status indicators
- Rounded corners throughout the interface
- Consistent spacing and calm hierarchy
- Line icons with simple geometry
- Large readable numbers for KPIs
- Compact but comfortable navigation

Avoid overly bright colors, heavy gradients, neumorphism, glassmorphism, harsh shadows, crowded dashboards, thick borders, and decorative illustrations unless they support analytics clarity.

---

## 2. Technology and Styling Assumptions

The reference is TailAdmin React, a React admin dashboard template built with TypeScript and Tailwind CSS. The public TailAdmin React repository uses React, TypeScript, Tailwind CSS v4, and the Outfit font family.

Recommended implementation stack:

```txt
React / Next.js / Laravel Inertia React
TypeScript
Tailwind CSS
ApexCharts / Recharts for charts
Lucide / Heroicons / custom line SVG icons
```

The design system should be implemented using utility-first classes or CSS variables so it can be reused across dashboard modules.

---

## 3. Font System

### Primary Font

Use **Outfit** as the primary font family.

```css
font-family: "Outfit", sans-serif;
```

Fallback:

```css
font-family: "Outfit", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Font Characteristics

Outfit gives the dashboard a modern, rounded, geometric, highly readable appearance. It works well for:

- Sidebar menu labels
- Dashboard headings
- KPI numbers
- Chart labels
- Buttons
- Forms
- Table text

### Font Weight Rules

Use a restrained weight scale:

| Use Case | Size | Weight | Line Height | Notes |
|---|---:|---:|---:|---|
| Page title | 24-30px | 600-700 | 32-38px | Use only if page header exists |
| Card title | 18-20px | 600 | 28-30px | Example: `Monthly Sales`, `Statistics` |
| Section subtitle | 14-16px | 400-500 | 20-24px | Muted supporting text |
| KPI value | 28-36px | 700 | 36-44px | Example: `3,782`, `5,359`, `75.55%` |
| Body text | 14-16px | 400-500 | 20-24px | Main dashboard copy |
| Sidebar menu | 14px | 500 | 20px | Medium weight for navigation |
| Sidebar dropdown item | 14px | 500 | 20px | Same as menu item |
| Caption / badge | 12px | 500-600 | 16-18px | Small labels and badges |
| Chart axis | 12-14px | 400-500 | 18-20px | Keep subtle and readable |

### Typography Rules

- Use `font-medium` for labels and navigation.
- Use `font-semibold` for card titles and major dashboard labels.
- Use `font-bold` or `font-semibold` for large KPI numbers.
- Avoid excessive font weights. Do not use many different weights in the same component.
- Keep paragraph text muted and less dominant than metric values.
- Do not use uppercase except for small category labels, badges, or table headers.

---

## 4. Color Palette

### Primary Brand Colors

Use the blue brand palette as the main accent system.

```css
--brand-25:  #F2F7FF;
--brand-50:  #ECF3FF;
--brand-100: #DDE9FF;
--brand-200: #C2D6FF;
--brand-300: #9CB9FF;
--brand-400: #7592FF;
--brand-500: #465FFF;
--brand-600: #3641F5;
--brand-700: #2A31D8;
--brand-800: #252DAE;
--brand-900: #262E89;
--brand-950: #161950;
```

Primary usage:

- Active sidebar item text: `brand-500`
- Active sidebar background: `brand-50`
- Main chart bars: `brand-500`
- Progress arc: `brand-500`
- Primary buttons: `brand-500`
- Focus ring: brand with low opacity

### Neutral Gray Palette

```css
--gray-25:  #FCFCFD;
--gray-50:  #F9FAFB;
--gray-100: #F2F4F7;
--gray-200: #E4E7EC;
--gray-300: #D0D5DD;
--gray-400: #98A2B3;
--gray-500: #667085;
--gray-600: #475467;
--gray-700: #344054;
--gray-800: #1D2939;
--gray-900: #101828;
--gray-950: #0C111D;
```

Neutral usage:

- Body background: `gray-50`
- Main card background: `white`
- Header and sidebar background: `white`
- Borders: `gray-200`
- Muted text: `gray-500` or `gray-600`
- Body text: `gray-700`
- Strong headings: `gray-900`
- Icons: `gray-500`, active icons `brand-500`

### Success Colors

```css
--success-50:  #ECFDF3;
--success-100: #D1FADF;
--success-500: #12B76A;
--success-600: #039855;
--success-700: #027A48;
```

Use for:

- Positive KPI percentage badges
- Up arrows
- Revenue increases
- Success states
- Confirmation indicators

### Error Colors

```css
--error-50:  #FEF3F2;
--error-100: #FEE4E2;
--error-500: #F04438;
--error-600: #D92D20;
--error-700: #B42318;
```

Use for:

- Negative KPI percentage badges
- Down arrows
- Declines
- Destructive actions
- Validation errors

### Warning Colors

```css
--warning-50:  #FFFAEB;
--warning-100: #FEF0C7;
--warning-500: #F79009;
--warning-600: #DC6803;
```

Use sparingly for warning states, pending labels, and attention notices.

### Base Colors

```css
--white: #FFFFFF;
--black: #101828;
```

### Color Distribution Rule

The dashboard should be approximately:

- 70-80% white and light gray
- 10-15% dark text
- 5-10% brand blue accent
- 2-5% green/red status color

Blue should guide attention but should not dominate the entire screen.

---

## 5. Layout System

### Desktop App Shell

The main dashboard uses a fixed sidebar, top header, and scrollable content area.

Recommended desktop structure:

```txt
Root
├── Sidebar: 280px wide, fixed left
├── Main Area: margin-left 280px
│   ├── Header: 72px high, sticky top
│   └── Content: padded dashboard grid
```

### Sidebar Dimensions

From the screenshot, the sidebar occupies roughly 18-19% of a 1440px-class desktop width. Use:

```css
--sidebar-width: 280px;
```

Desktop sidebar:

- Width: `280px`
- Background: `white`
- Right border: `1px solid gray-200`
- Height: `100vh`
- Position: fixed or sticky
- Vertical overflow: scrollable with hidden/minimal scrollbar

### Header Dimensions

Top header:

- Height: `72px`
- Background: `white`
- Bottom border: `1px solid gray-200`
- Position: sticky top if content scrolls
- Z-index above content
- Left aligned menu toggle and search
- Right aligned theme toggle, notification button, avatar, profile dropdown

### Content Area

Dashboard content:

- Background: `gray-50`
- Padding desktop: `24px`
- Padding large desktop: `24px 24px 32px`
- Padding tablet: `20px`
- Padding mobile: `16px`
- Gap between cards: `24px`

Recommended main content wrapper:

```css
.dashboard-content {
  background: #F9FAFB;
  padding: 24px;
}
```

### Dashboard Grid

The screenshot uses a 12-column desktop grid.

Recommended grid:

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 24px;
}
```

Typical desktop layout:

```txt
Left section: 7 columns
Right section: 5 columns
```

For the visible dashboard:

```txt
Row 1:
- Customers card: 3.5-4 columns inside left section
- Orders card: 3.5-4 columns inside left section
- Monthly Target card: 5 columns right section, spans two rows visually

Row 2:
- Monthly Sales chart: 7 columns left section
- Monthly Target continues on right

Row 3:
- Statistics card: 12 columns full width
```

Simpler implementation:

```txt
Desktop >= 1280px:
main grid = 12 columns
left analytics column = span 7 or 8
right target column = span 4 or 5

Tablet:
main grid = 1 column
cards stack vertically

Mobile:
single column
sidebar becomes drawer
header search collapses
```

---

## 6. Spacing System

Use an 8px-based spacing system, with occasional 4px increments.

### Global Spacing Scale

```txt
4px   = micro spacing
8px   = tight internal spacing
12px  = compact item spacing
16px  = standard component padding
20px  = medium card padding
24px  = default dashboard gap and card padding
28px  = large internal spacing
32px  = large section spacing
40px  = major vertical separation
```

### Specific Spacing Rules

#### Page Content

- Desktop content padding: `24px`
- Mobile content padding: `16px`
- Gap between top-level dashboard cards: `24px`
- Gap between KPI cards: `24px`

#### Cards

- Standard card padding: `24px`
- Compact stat card padding: `24px 24px`
- Chart card padding: `24px`
- Card title to subtitle: `4px-8px`
- Card title to chart area: `24px-32px`

#### Sidebar

- Sidebar outer padding: `20px 20px 24px`
- Logo bottom spacing: `36px-40px`
- Section label bottom spacing: `12px-16px`
- Menu item padding: `8px 12px`
- Menu item gap: `12px`
- Menu item vertical gap: `4px-8px`
- Dropdown indentation: `44px-52px` from left edge

#### Header

- Header horizontal padding: `24px`
- Space between left controls: `16px`
- Space between right icon buttons: `12px`
- Search input left icon to text: `12px`

---

## 7. Border Radius System

Rounded corners are a major part of the UI style.

### Radius Scale

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-3xl: 20px;
--radius-full: 9999px;
```

### Component Radius Rules

| Component | Radius |
|---|---:|
| Main dashboard card | 16px |
| Large analytics card | 16px |
| Sidebar active item | 8px-10px |
| Sidebar dropdown item | 8px |
| Header icon button | 9999px or 50% |
| Search input | 10px-12px |
| KPI icon square | 12px |
| Percentage badge | 9999px |
| Segmented control wrapper | 8px-10px |
| Segmented control active tab | 6px-8px |
| Date picker button | 8px-10px |
| Avatar | 9999px |

### Important Rule

Use rounded corners consistently. Do not mix sharp cards with rounded controls. The design should look soft and approachable.

---

## 8. Border and Shadow Rules

### Border Style

The UI relies more on thin borders than visible shadows.

Default border:

```css
border: 1px solid #E4E7EC;
```

Use borders for:

- Cards
- Sidebar separation
- Header separation
- Icon buttons
- Search input
- Chart cards
- Segmented controls
- Date range selector
- Tables and dividers

### Shadow Style

Cards in the screenshot are mostly flat with minimal or no shadow. If shadows are used, they should be very subtle.

Recommended shadow tokens:

```css
--shadow-xs: 0px 1px 2px rgba(16, 24, 40, 0.05);
--shadow-sm: 0px 1px 3px rgba(16, 24, 40, 0.10), 0px 1px 2px rgba(16, 24, 40, 0.06);
--shadow-md: 0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
```

Default card shadow:

```css
box-shadow: none;
```

Optional hover shadow:

```css
box-shadow: var(--shadow-xs);
```

Avoid:

- Heavy drop shadows
- Black shadows above 10% opacity
- Floating glass effects
- Strong card elevation

---

## 9. Sidebar Design

### Sidebar Structure

The sidebar contains:

1. Logo area
2. Section label: `MENU`
3. Main navigation group
4. Active expandable `Dashboard` item
5. Dropdown child items
6. Additional menu items with optional `NEW` badges
7. Lower app navigation groups

### Sidebar Background

```css
background: #FFFFFF;
border-right: 1px solid #E4E7EC;
```

### Logo Area

Logo layout:

- Horizontal flex row
- Icon size: `32px-36px`
- Text size: `22px-24px`
- Font weight: `600-700`
- Color: `gray-900`
- Padding top: `24px`
- Padding left/right: `24px`

Logo icon style:

- Rounded square, around `8px`
- Blue gradient or solid blue background
- White vertical chart-like mark

### Sidebar Section Label

Example: `MENU`

Style:

```css
font-size: 12px;
line-height: 18px;
font-weight: 500;
color: #98A2B3;
letter-spacing: 0;
text-transform: uppercase;
```

Spacing:

- Margin top after logo: `36px-40px`
- Margin bottom: `12px-16px`

### Main Menu Item

Base menu item:

```css
height: 40px-48px;
display: flex;
align-items: center;
gap: 12px;
padding: 8px 12px;
border-radius: 8px;
font-size: 14px;
line-height: 20px;
font-weight: 500;
color: #344054;
```

Icon:

- Size: `20px-24px`
- Stroke width: `1.5-2px`
- Default color: `gray-500`
- Active color: `brand-500`

### Active Menu Item

Active parent item:

```css
background: #ECF3FF;
color: #465FFF;
border-radius: 8px;
```

The active parent contains:

- Active blue icon
- Active blue label
- Chevron arrow on the right
- Arrow color blue
- Arrow rotated when expanded

### Dropdown Menu Item

Dropdown items appear indented below the parent.

Style:

```css
padding: 10px 12px;
border-radius: 8px;
font-size: 14px;
font-weight: 500;
color: #101828 or #344054;
```

Active dropdown item:

```css
background: #ECF3FF;
color: #465FFF;
```

Dropdown indentation:

```css
margin-left: 44px;
```

Spacing between dropdown items:

```css
gap: 4px;
```

### `NEW` Badge

Badge style:

```css
height: 22px-24px;
padding: 2px 10px;
border-radius: 9999px;
background: #ECFDF3;
color: #039855;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
```

Position:

- Right side of menu item
- Aligned vertically center
- Keep enough gap from arrow if item is expandable

### Sidebar Hover Behavior

Inactive menu item hover:

```css
background: #F2F4F7;
color: #344054;
```

Icon hover:

```css
color: #344054;
```

Do not use heavy hover effects. Keep transitions short:

```css
transition: color 150ms ease, background-color 150ms ease;
```

---

## 10. Header Design

### Header Container

```css
height: 72px;
background: #FFFFFF;
border-bottom: 1px solid #E4E7EC;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 24px;
```

### Left Header Controls

Contains:

1. Sidebar toggle button
2. Search input

#### Sidebar Toggle Button

Style:

```css
width: 40px;
height: 40px;
border: 1px solid #E4E7EC;
border-radius: 10px;
background: #FFFFFF;
display: flex;
align-items: center;
justify-content: center;
color: #667085;
```

Hover:

```css
background: #F9FAFB;
color: #344054;
```

Icon size: `20px-22px`.

### Search Input

The search field is a large rounded input with an icon and command shortcut.

Container:

```css
width: 420px-520px;
height: 40px-44px;
border: 1px solid #E4E7EC;
border-radius: 10px;
background: #FFFFFF;
display: flex;
align-items: center;
padding: 0 12px 0 16px;
```

Text:

```css
font-size: 14px;
font-weight: 400;
color: #667085;
```

Placeholder:

```css
color: #98A2B3;
```

Search icon:

- Size: `20px`
- Color: `gray-500`

Keyboard shortcut badge:

```css
height: 28px;
padding: 0 8px;
border: 1px solid #E4E7EC;
border-radius: 8px;
font-size: 12px;
color: #667085;
background: #FFFFFF;
```

### Right Header Controls

Contains:

1. Dark mode toggle icon button
2. Notification icon button with dot
3. Avatar
4. Username
5. Chevron dropdown

#### Header Icon Button

```css
width: 44px;
height: 44px;
border-radius: 9999px;
border: 1px solid #E4E7EC;
background: #FFFFFF;
color: #667085;
display: flex;
align-items: center;
justify-content: center;
```

Hover:

```css
background: #F9FAFB;
color: #344054;
```

Icon size: `20px-22px`.

#### Notification Dot

```css
width: 8px;
height: 8px;
border-radius: 9999px;
background: #FD853A;
position: absolute;
top: 8px;
right: 8px;
```

#### User Avatar

```css
width: 44px;
height: 44px;
border-radius: 9999px;
object-fit: cover;
```

Username:

```css
font-size: 14px;
font-weight: 500;
color: #101828;
```

Spacing:

- Avatar to username: `12px`
- Username to chevron: `6px-8px`

---

## 11. Card System

### Base Card

All dashboard cards should use the same base card style.

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E4E7EC;
  border-radius: 16px;
  padding: 24px;
  box-shadow: none;
}
```

Dark mode equivalent can use a dark gray background and low-opacity white borders, but the screenshot is light mode.

### Card Header

For cards with titles:

```css
.card-title {
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  color: #101828;
}

.card-subtitle {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #475467;
  margin-top: 4px;
}
```

Card header layout:

```css
display: flex;
align-items: flex-start;
justify-content: space-between;
```

For the three-dot menu:

- Icon color: `gray-400` or `gray-500`
- Button size: `32px-36px`
- Keep it subtle

### Card Internal Spacing

- Title to chart: `24px-32px`
- Icon to label: `28px-32px`
- Label to KPI value: `12px-16px`
- KPI value to percentage badge horizontally aligned

---

## 12. KPI / Metric Card Design

The top metric cards show an icon, label, large value, and status badge.

### KPI Card Layout

```txt
Card
├── Icon square
├── Spacer
├── Label
└── Bottom row
    ├── Large value
    └── Percentage badge
```

### KPI Card Size

Desktop approximate:

```css
min-height: 175px-180px;
padding: 28px 24px;
```

### Icon Square

```css
width: 48px;
height: 48px;
border-radius: 12px;
background: #F2F4F7;
display: flex;
align-items: center;
justify-content: center;
color: #344054;
```

Icon size:

```css
width: 22px;
height: 22px;
stroke-width: 1.7-2px;
```

### KPI Label

```css
font-size: 14px;
line-height: 20px;
font-weight: 400-500;
color: #475467;
```

### KPI Value

```css
font-size: 30px-32px;
line-height: 38px;
font-weight: 700;
letter-spacing: -0.02em;
color: #101828;
```

### Percentage Badge

Positive:

```css
height: 26px;
padding: 4px 10px;
border-radius: 9999px;
background: #ECFDF3;
color: #039855;
font-size: 14px;
font-weight: 600;
display: inline-flex;
align-items: center;
gap: 4px;
```

Negative:

```css
background: #FEF3F2;
color: #D92D20;
```

Arrow icon:

- Size: `14px-16px`
- Stroke width: `2px`
- Up arrow for positive, down arrow for negative

---

## 13. Monthly Sales Bar Chart Card

### Card Layout

```css
height: auto;
min-height: 235px-260px;
padding: 24px;
```

Header:

```txt
Monthly Sales                      three-dot menu
```

### Chart Area

- Top margin after title: `24px`
- Left axis labels: small muted gray
- Horizontal grid lines: very light gray `gray-100`
- Bars: solid brand blue `#465FFF`
- Bars are rounded at the top
- No heavy chart border
- No unnecessary chart legend for simple single-series chart

### Chart Bar Style

```css
bar-color: #465FFF;
bar-radius: 6px 6px 0 0;
bar-width: 16px-20px;
```

### Chart Axis Label Style

```css
font-size: 12px-14px;
font-weight: 400;
color: #344054 or #475467;
```

### Grid Lines

```css
stroke: #F2F4F7;
stroke-width: 1px;
```

### Month Labels

Use short month labels:

```txt
Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
```

Spacing between month labels should be even. Keep chart height moderate and readable.

---

## 14. Monthly Target Gauge Card

The Monthly Target card is the largest visual card on the right side.

### Container

```css
background: #FFFFFF;
border: 1px solid #E4E7EC;
border-radius: 16px;
overflow: hidden;
```

The card has two visual regions:

1. Main white upper content
2. Light gray bottom summary panel

### Upper Region

```css
padding: 28px 28px 36px;
background: #FFFFFF;
```

Header:

```txt
Monthly Target              three-dot menu
Target you've set for each month
```

Title:

```css
font-size: 20px;
line-height: 30px;
font-weight: 600;
color: #101828;
```

Subtitle:

```css
font-size: 14px;
line-height: 20px;
font-weight: 400;
color: #475467;
```

### Gauge Chart

The gauge is a semi-circular progress arc.

Gauge rules:

- Use a semi-circle arc, not a full donut
- Track color: `#F2F4F7` or `#E4E7EC`
- Progress color: `#465FFF`
- Stroke width: `12px-14px`
- Rounded stroke caps
- Center value: large percentage
- Positive status badge below the percentage

Gauge size:

```css
width: 300px-360px;
height: 170px-200px;
margin: 24px auto 0;
```

Center percentage:

```css
font-size: 34px-40px;
line-height: 44px;
font-weight: 700;
color: #101828;
letter-spacing: -0.02em;
```

Small badge under percentage:

```css
background: #ECFDF3;
color: #039855;
border-radius: 9999px;
padding: 4px 10px;
font-size: 12px;
font-weight: 600;
```

Supporting copy:

```css
font-size: 16px;
line-height: 24px;
font-weight: 400;
color: #475467;
text-align: center;
max-width: 360px;
margin: 24px auto 0;
```

### Bottom Summary Panel

```css
background: #F2F4F7;
padding: 28px 24px;
display: grid;
grid-template-columns: repeat(3, 1fr);
```

Each stat item:

```txt
Label
$20K arrow
```

Label:

```css
font-size: 14px;
font-weight: 400-500;
color: #475467;
text-align: center;
```

Value:

```css
font-size: 20px-22px;
font-weight: 700;
color: #101828;
text-align: center;
```

Vertical dividers:

```css
border-left: 1px solid #E4E7EC;
```

Use red down arrow for target decline and green up arrow for revenue/today increase.

---

## 15. Statistics Card

The Statistics card is a larger full-width analytics section.

### Header Layout

```txt
Left:
Statistics
Target you've set for each month

Right:
Segmented Control: Monthly | Quarterly | Annually
Date Range Button: May 10 to May 16
```

### Card Container

```css
background: #FFFFFF;
border: 1px solid #E4E7EC;
border-radius: 16px;
padding: 24px;
```

### Header Spacing

```css
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;
margin-bottom: 24px-32px;
```

On mobile, stack header controls vertically.

### Segmented Control

Wrapper:

```css
height: 44px;
padding: 4px;
border-radius: 10px;
background: #F2F4F7;
display: inline-flex;
```

Inactive tab:

```css
padding: 8px 16px;
border-radius: 8px;
font-size: 14px;
font-weight: 500;
color: #667085;
```

Active tab:

```css
background: #FFFFFF;
color: #101828;
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
```

### Date Range Button

```css
height: 44px;
padding: 0 16px;
border: 1px solid #E4E7EC;
border-radius: 10px;
background: #FFFFFF;
font-size: 14px;
font-weight: 500;
color: #344054;
display: inline-flex;
align-items: center;
gap: 8px;
```

Calendar icon:

- Size: `18px-20px`
- Color: `gray-500`

---

## 16. Buttons

### Primary Button

```css
height: 44px;
padding: 10px 18px;
border-radius: 10px;
background: #465FFF;
color: #FFFFFF;
font-size: 14px;
font-weight: 500;
```

Hover:

```css
background: #3641F5;
```

Focus:

```css
box-shadow: 0px 0px 0px 4px rgba(70, 95, 255, 0.12);
```

### Secondary Button

```css
height: 44px;
padding: 10px 18px;
border-radius: 10px;
background: #FFFFFF;
border: 1px solid #E4E7EC;
color: #344054;
font-size: 14px;
font-weight: 500;
```

Hover:

```css
background: #F9FAFB;
```

### Icon Button

```css
width: 40px-44px;
height: 40px-44px;
border-radius: 10px or 9999px;
border: 1px solid #E4E7EC;
background: #FFFFFF;
color: #667085;
```

Use circular icon buttons in the header and rounded-square icon buttons in cards/forms.

---

## 17. Form Elements

### Input

```css
height: 44px;
border: 1px solid #E4E7EC;
border-radius: 10px;
background: #FFFFFF;
padding: 10px 14px;
font-size: 14px;
font-weight: 400;
color: #101828;
```

Placeholder:

```css
color: #98A2B3;
```

Focus:

```css
border-color: #465FFF;
box-shadow: 0px 0px 0px 4px rgba(70, 95, 255, 0.12);
outline: none;
```

### Label

```css
font-size: 14px;
font-weight: 500;
color: #344054;
margin-bottom: 6px;
```

### Helper Text

```css
font-size: 12px;
line-height: 18px;
color: #667085;
margin-top: 6px;
```

### Select

Same as input, with right chevron icon.

### Textarea

```css
min-height: 96px-120px;
border-radius: 10px;
padding: 12px 14px;
resize: vertical;
```

---

## 18. Table Design

Although not visible in the screenshot, TailAdmin dashboards commonly use tables. Keep them consistent with the card system.

### Table Container

```css
background: #FFFFFF;
border: 1px solid #E4E7EC;
border-radius: 16px;
overflow: hidden;
```

### Table Header

```css
background: #F9FAFB;
color: #667085;
font-size: 12px;
font-weight: 500-600;
text-transform: uppercase;
letter-spacing: 0.02em;
```

Header cell:

```css
padding: 12px 16px;
border-bottom: 1px solid #E4E7EC;
```

### Table Body Cell

```css
padding: 16px;
font-size: 14px;
font-weight: 400;
color: #344054;
border-bottom: 1px solid #E4E7EC;
```

### Row Hover

```css
background: #F9FAFB;
```

### Table Text Hierarchy

- Main entity name: `gray-900`, `font-medium`
- Secondary metadata: `gray-500`, `font-normal`
- Numeric value: `gray-900`, `font-medium`
- Status: badge component

---

## 19. Badge System

### Base Badge

```css
display: inline-flex;
align-items: center;
gap: 4px;
border-radius: 9999px;
padding: 2px 8px;
font-size: 12px;
line-height: 18px;
font-weight: 500-600;
```

### Success Badge

```css
background: #ECFDF3;
color: #039855;
```

### Error Badge

```css
background: #FEF3F2;
color: #D92D20;
```

### Warning Badge

```css
background: #FFFAEB;
color: #DC6803;
```

### Brand Badge

```css
background: #ECF3FF;
color: #465FFF;
```

### Gray Badge

```css
background: #F2F4F7;
color: #475467;
```

---

## 20. Icon Style

### General Icon Rules

- Use line icons, not filled icons, unless part of a logo.
- Stroke width: `1.5px-2px`
- Rounded stroke caps and joins where possible
- Default icon size: `20px`
- Sidebar icon size: `24px`
- Header icon size: `20px-22px`
- KPI card icon size: `22px-24px`

### Icon Colors

```css
Default: #667085 or #475467
Muted:   #98A2B3
Active:  #465FFF
Success: #039855
Error:   #D92D20
```

### Icon Containers

Use icon containers for KPI cards and feature blocks:

```css
width: 48px;
height: 48px;
border-radius: 12px;
background: #F2F4F7;
```

Do not put every sidebar icon in a container. Sidebar icons should usually be plain line icons.

---

## 21. Chart Design Rules

### General Chart Rules

- Charts should be clean and readable.
- Use minimal axis labels.
- Use subtle grid lines.
- Avoid thick borders around chart areas.
- Use brand blue for the primary series.
- Use green/red only for positive/negative comparisons.
- Keep legends simple and muted.
- Avoid unnecessary gradients, shadows, or decorative effects.

### Chart Text

```css
font-size: 12px-14px;
font-weight: 400;
color: #475467;
```

### Tooltip

```css
background: #FFFFFF;
border: 1px solid #E4E7EC;
border-radius: 8px-10px;
padding: 10px-12px;
box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.10);
font-size: 12px;
color: #344054;
```

### Grid Line

```css
stroke: #F2F4F7;
```

### Bar Chart

```css
primary-bar: #465FFF;
bar-radius: 6px;
bar-width: 16px-20px;
```

### Donut / Gauge

```css
track: #F2F4F7;
progress: #465FFF;
stroke-linecap: round;
stroke-width: 12px-14px;
```

---

## 22. Responsive Behavior

### Desktop: >= 1280px

- Sidebar visible and fixed
- Header search full width around 420-520px
- Dashboard uses multi-column grid
- KPI cards sit side by side
- Monthly Target appears on the right

### Laptop / Tablet: 768px-1279px

- Sidebar can collapse or become a drawer
- Dashboard grid reduces to 1-2 columns
- Header search may shrink
- User profile name can be hidden if space is limited
- Monthly Target stacks below KPI cards

### Mobile: < 768px

- Sidebar becomes off-canvas drawer
- Header height remains around 64-72px
- Search becomes icon button or full-width row under header
- Cards stack vertically
- Card padding reduces to `16px-20px`
- Chart containers become horizontally scrollable if necessary
- Segmented controls wrap or become scrollable horizontally

### Mobile Card Rules

```css
.card {
  border-radius: 14px-16px;
  padding: 16px;
}
```

KPI value on mobile:

```css
font-size: 26px-30px;
line-height: 34px-38px;
```

---

## 23. Interaction and Motion

### Transition Timing

Use short, subtle transitions:

```css
transition-duration: 150ms-200ms;
transition-timing-function: ease;
```

Apply transitions to:

- Button hover states
- Menu item hover states
- Dropdown open/close
- Sidebar collapse
- Focus rings
- Card hover if used

### Hover States

- Sidebar menu hover: light gray background
- Button hover: slightly darker background
- Card hover: optional very subtle shadow or border darkening
- Icon button hover: gray background

### Focus States

Keyboard focus must be visible.

Use:

```css
box-shadow: 0px 0px 0px 4px rgba(70, 95, 255, 0.12);
```

### Avoid

- Bouncy animations
- Slow transitions above 300ms for basic UI
- Large scale effects
- Excessive motion in dashboards

---

## 24. Dark Mode Guidelines

The screenshot is light mode, but the design includes a dark mode toggle. If implementing dark mode, follow these rules.

### Dark Backgrounds

```css
page-background: #0C111D or #101828;
card-background: #1A2231;
border: rgba(255,255,255,0.05) or #344054;
```

### Dark Text

```css
primary-text: rgba(255,255,255,0.90);
secondary-text: #98A2B3;
muted-text: #667085;
```

### Dark Active Menu

```css
background: rgba(70, 95, 255, 0.12);
color: #7592FF;
```

### Dark Mode Rule

Maintain the same spacing, radius, layout, and hierarchy. Only adapt colors.

---

## 25. Accessibility Rules

- Text must have sufficient contrast against backgrounds.
- Interactive elements must have clear hover and focus states.
- Icon-only buttons must have accessible labels.
- Sidebar dropdowns must be keyboard navigable.
- Do not rely on color alone for positive/negative values; include arrows or labels.
- Chart data should be readable through tooltips or summaries.
- Use semantic HTML for navigation, buttons, forms, tables, and headings.

Recommended minimum target sizes:

```txt
Buttons: 40px height minimum
Icon buttons: 40x40px minimum
Menu items: 40px height minimum
```

---

## 26. Component Implementation Tokens

### CSS Variables

```css
:root {
  --font-sans: "Outfit", sans-serif;

  --color-white: #FFFFFF;
  --color-black: #101828;

  --color-brand-50: #ECF3FF;
  --color-brand-100: #DDE9FF;
  --color-brand-500: #465FFF;
  --color-brand-600: #3641F5;

  --color-gray-25: #FCFCFD;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F2F4F7;
  --color-gray-200: #E4E7EC;
  --color-gray-300: #D0D5DD;
  --color-gray-400: #98A2B3;
  --color-gray-500: #667085;
  --color-gray-600: #475467;
  --color-gray-700: #344054;
  --color-gray-800: #1D2939;
  --color-gray-900: #101828;

  --color-success-50: #ECFDF3;
  --color-success-500: #12B76A;
  --color-success-600: #039855;

  --color-error-50: #FEF3F2;
  --color-error-500: #F04438;
  --color-error-600: #D92D20;

  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  --shadow-xs: 0px 1px 2px rgba(16, 24, 40, 0.05);
  --shadow-sm: 0px 1px 3px rgba(16, 24, 40, 0.10), 0px 1px 2px rgba(16, 24, 40, 0.06);

  --sidebar-width: 280px;
  --header-height: 72px;
}
```

### Tailwind-Like Utility Mapping

```txt
App background: bg-gray-50
Card: bg-white border border-gray-200 rounded-2xl p-6
Title: text-xl font-semibold text-gray-900
Subtitle: text-sm text-gray-600
Muted text: text-gray-500
Primary text: text-gray-900
Active nav: bg-brand-50 text-brand-500
Primary button: bg-brand-500 hover:bg-brand-600 text-white
Success badge: bg-success-50 text-success-600
Error badge: bg-error-50 text-error-600
```

---

## 27. Example Component Blueprints

### Base Card

```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-6">
  <div className="flex items-start justify-between">
    <div>
      <h3 className="text-xl font-semibold text-gray-900">Card Title</h3>
      <p className="mt-1 text-sm text-gray-600">Supporting description</p>
    </div>
    <button className="text-gray-400 hover:text-gray-600">...</button>
  </div>
</div>
```

### KPI Card

```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-6">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
    <Icon className="h-6 w-6" />
  </div>

  <p className="mt-8 text-sm font-medium text-gray-600">Customers</p>

  <div className="mt-3 flex items-end justify-between">
    <h3 className="text-3xl font-bold tracking-tight text-gray-900">3,782</h3>
    <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-sm font-semibold text-success-600">
      ↑ 11.01%
    </span>
  </div>
</div>
```

### Sidebar Menu Item

```tsx
<a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
  <Icon className="h-6 w-6 text-gray-500" />
  <span>Dashboard</span>
</a>
```

### Active Sidebar Menu Item

```tsx
<a className="flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-500">
  <Icon className="h-6 w-6 text-brand-500" />
  <span>Dashboard</span>
</a>
```

---

## 28. Design Do and Don't

### Do

- Use Outfit font consistently.
- Keep cards white with thin gray borders.
- Use `#465FFF` as the main brand accent.
- Use plenty of spacing between dashboard sections.
- Use rounded corners consistently.
- Use subtle status badges for percentages and states.
- Keep charts clean and minimal.
- Use line icons with consistent stroke width.
- Keep the sidebar visually calm and easy to scan.

### Don't

- Do not use thick borders.
- Do not use heavy shadows.
- Do not use saturated colors everywhere.
- Do not overcrowd cards with too many metrics.
- Do not mix many fonts.
- Do not use decorative gradients in cards unless required.
- Do not use sharp square cards.
- Do not make chart labels too dark or too large.
- Do not make the sidebar active state overly intense.

---

## 29. Screenshot-Specific Visual Notes

From the provided screenshot:

- The left sidebar is white, fixed, and separated by a thin gray border.
- The main background is a very light gray.
- Cards are white with `16px` rounded corners and thin gray borders.
- The header is white with a bottom border and rounded search control.
- Active navigation uses a pale blue background and bright blue text.
- KPI cards use large dark numbers with small status badges.
- The chart uses solid blue bars with faint grid lines.
- The Monthly Target card uses a large semi-circle gauge with a blue progress arc and pale gray track.
- The bottom summary region of the target card uses a light gray background, split into three equal columns.
- The Statistics card uses a segmented control with a gray wrapper and white active tab.
- The design prioritizes clarity, breathing room, and consistent geometry.

---

## 30. Final Design Goal

When applying this design system, the final dashboard should look like a polished TailAdmin-style SaaS admin interface:

- Calm white-and-gray dashboard shell
- Blue brand highlights only where needed
- Rounded, bordered metric cards
- Clean data visualizations
- Professional navigation and header
- Consistent typography and spacing
- Suitable for ecommerce, analytics, CRM, SaaS, logistics, finance, AI, or internal admin products
