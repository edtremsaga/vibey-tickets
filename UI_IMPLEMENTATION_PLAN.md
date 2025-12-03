# UI Implementation Plan - Vibey Tickets

## Overview
This document outlines the exact implementation plan for matching the provided screenshots.

---

## 1. MAIN PAGE LAYOUT (`app/page.tsx`)

### Header Section
```
┌─────────────────────────────────────────┐
│         Vibey Tickets                   │  ← Large gradient text (purple to pink)
│                                         │  ← NO subtitle/description
└─────────────────────────────────────────┘
```

**Styling:**
- Text: `text-4xl sm:text-5xl font-extrabold`
- Gradient: `bg-gradient-to-r from-purple-400 to-pink-500`
- Centered, no margin below

---

### Introduction Cards Section (ALWAYS VISIBLE)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Set Your     │  │ We Scan the  │  │ Get the      │
│ Watch        │  │ Market       │  │ Price Alert  │
│              │  │              │  │              │
│ Tells you to │  │ Explains     │  │ Describes    │
│ add an event │  │ that the app │  │ the email    │
│ and your     │  │ will check   │  │ notification │
│ target price │  │ prices for   │  │ you'll       │
│              │  │ you          │  │ receive      │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Styling:**
- Background: `bg-gray-800/40` (slightly lighter dark)
- Border: `border border-gray-700/50`
- Rounded: `rounded-xl`
- Text: **White** (not gray, not purple)
  - Titles: `text-white font-bold text-lg`
  - Descriptions: `text-white text-sm`
- Layout: 3 columns on desktop, 1 column on mobile
- Spacing: `gap-6`, `p-6`

---

### Add New Watch Button (ALWAYS VISIBLE)
```
┌─────────────────────────────┐
│  +  Add New Watch           │  ← Purple button, white text
└─────────────────────────────┘
```

**Styling:**
- Background: `bg-purple-600`
- Text: White, bold
- Icon: Plus icon on left
- Centered
- Rounded corners

---

### Empty State Message (when no watches)
```
You're not watching any events yet.
Click "Add New Watch" to get started.
```

**Styling:**
- Centered
- White text
- Two lines, stacked

---

### Watch Cards Section (when watches exist)
```
┌─────────────────────────────────────┐
│  [refresh] [delete]                │
│                                     │
│  taylor swift                       │  ← lowercase, bold
│  climate pledge                     │  ← lowercase
│  seattle                            │  ← lowercase
│  Thursday, December 25, 2025       │
│                                     │
│  ┌─────────────┐  ┌─────────────┐ │
│  │ YOUR TARGET │  │ CURRENT     │ │
│  │             │  │ PRICE       │ │
│  │ $100.00     │  │ $425.00     │ │  ← Large, bold
│  │             │  │             │ │
│  │ ($100.00    │  │ (@Ticket-   │ │
│  │ total for 1)│  │ master)     │ │
│  └─────────────┘  └─────────────┘ │
│                                     │
│  Last checked: 12/2/2025, 4:55:07 PM│
└─────────────────────────────────────┘
```

**Key Features:**
- Event name, venue, location: **lowercase**
- Two-column price layout:
  - Left: "YOUR TARGET" (label) → Purple price (large, bold)
  - Right: "CURRENT PRICE" (label) → White price (large, bold)
- Broker source: `(@Ticketmaster)` in smaller text
- Total price calculation shown: `($X.XX total for N)`
- Refresh and delete icons in top-right corner
- Last checked timestamp at bottom

---

### Footer (ALWAYS VISIBLE)
```
Your watches are saved locally in this browser.
```

**Styling:**
- Left-aligned
- Small white text
- Bottom of page

---

## 2. ADD NEW WATCH MODAL (`components/AddWatchForm.tsx`)

### Modal Structure
```
┌─────────────────────────────────────────┐
│  Add New Watch                          │  ← Large, bold, white
│  Enter event details to start tracking. │  ← Smaller, gray
│                                         │
│  Event Name                             │
│  ┌───────────────────────────────────┐ │
│  │ e.g., Taylor Swift: The Eras Tour │ │  ← White background
│  └───────────────────────────────────┘ │
│                                         │
│  Event Venue                            │
│  ┌───────────────────────────────────┐ │
│  │ e.g., SoFi Stadium                │ │  ← White background
│  └───────────────────────────────────┘ │
│                                         │
│  Venue Location                         │
│  ┌───────────────────────────────────┐ │
│  │ e.g., Seattle, WA                 │ │  ← White background
│  └───────────────────────────────────┘ │
│                                         │
│  Event Date                             │
│  ┌───────────────────────────────────┐ │
│  │ mm/dd/yyyy              [📅]       │ │  ← Calendar icon
│  └───────────────────────────────────┘ │
│                                         │
│  Target Price ($)                       │
│  ┌───────────────────────────────────┐ │
│  │ e.g., 350              [▲] [▼]    │ │  ← Number stepper
│  └───────────────────────────────────┘ │
│                                         │
│  # of Tickets                           │
│  ┌───────────────────────────────────┐ │
│  │ 1                      [▲] [▼]     │ │  ← Number stepper
│  └───────────────────────────────────┘ │  ← Purple border when focused
│                                         │
│                    [Cancel]  [Add Watch]│
└─────────────────────────────────────────┘
```

**Key Features:**
- **White input fields** with dark text (not dark fields)
- Two-column layout for some fields (Event Venue + Venue Location side by side)
- Date field has calendar icon on right
- Number fields (Target Price, # of Tickets) have up/down arrows
- Focused field shows purple border
- Buttons: Cancel (text only) and Add Watch (purple button with plus icon)

**Form Layout:**
- Row 1: Event Name (full width)
- Row 2: Event Venue (left) + Venue Location (right)
- Row 3: Event Date (left) + Target Price (right)
- Row 4: # of Tickets (full width)
- Row 5: Buttons (right-aligned)

---

## 3. WATCH CARD COMPONENT (`components/WatchCard.tsx`)

### Card Layout
```
┌─────────────────────────────────────┐
│  [🔄] [🗑️]                         │  ← Top-right icons
│                                     │
│  taylor swift                       │  ← lowercase, bold, white
│  climate pledge                     │  ← lowercase, white
│  seattle                            │  ← lowercase, white
│  Thursday, December 25, 2025       │  ← white
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │ YOUR TARGET  │  │ CURRENT      ││
│  │              │  │ PRICE        ││
│  │              │  │              ││
│  │   $100.00    │  │   $425.00    ││  ← Large, bold
│  │              │  │              ││
│  │              │  │              ││
│  │ ($100.00     │  │ (@Ticket-    ││
│  │ total for 1) │  │ master)      ││
│  └──────────────┘  └──────────────┘│
│                                     │
│  Last checked: 12/2/2025, 4:55:07 PM│
└─────────────────────────────────────┘
```

**Key Features:**
- **NO status badges** (remove "Watching", "Price Alert", etc.)
- **NO status messages** (remove "Price is above/below target")
- Event details in lowercase
- Two-column price section:
  - Left column: "YOUR TARGET" label, purple price, total calculation
  - Right column: "CURRENT PRICE" label, white price, broker source
- Icons in top-right (refresh, delete)
- Timestamp at bottom

**Styling:**
- Dark card background
- White text for all content
- Purple accent for target price only
- Rounded corners
- Border

---

## 4. COLOR SCHEME

### Colors
- **Background:** Dark gray (`bg-gray-900`)
- **Card Background:** Slightly lighter dark (`bg-gray-800/40`)
- **Text:** White (`text-white`)
- **Accent:** Purple (`purple-600`, `purple-400`)
- **Input Fields:** White background with dark text
- **Buttons:** Purple background (`bg-purple-600`)

### Typography
- **Headers:** Bold, large
- **Body:** Regular weight
- **Labels:** Small, uppercase for price labels
- **Event names:** lowercase

---

## 5. LAYOUT SPECIFICATIONS

### Spacing
- Header to cards: `mb-8`
- Cards to button: `mb-10`
- Button to content: `mb-8` or `mb-10`
- Cards gap: `gap-6`
- Footer margin: `mt-8`

### Responsive
- Mobile: Single column
- Tablet: 2 columns for watch cards
- Desktop: 3 columns for watch cards

---

## 6. COMPONENTS TO UPDATE

1. ✅ `app/page.tsx` - Main layout (DONE - needs verification)
2. ✅ `components/Introduction.tsx` - Intro cards (DONE - needs verification)
3. ⏳ `components/AddWatchForm.tsx` - Modal form (TODO)
4. ⏳ `components/WatchCard.tsx` - Watch cards (TODO)

---

## 7. IMPLEMENTATION ORDER

1. Verify main page layout is correct
2. Update Add Watch Modal (white inputs, 2-column layout, number steppers)
3. Update Watch Cards (new layout, remove status badges, lowercase text)

---

## 8. KEY DIFFERENCES FROM CURRENT UI

### Current vs. Desired

**Main Page:**
- ❌ Current: Subtitle under header
- ✅ Desired: No subtitle

**Intro Cards:**
- ❌ Current: Gray text
- ✅ Desired: White text

**Modal:**
- ❌ Current: Dark input fields
- ✅ Desired: White input fields

**Watch Cards:**
- ❌ Current: Status badges, status messages, single price display
- ✅ Desired: Two-column price layout, no status badges, lowercase text

---

This plan will be implemented step-by-step with your approval at each stage.

