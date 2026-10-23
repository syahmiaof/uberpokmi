---
name: UberPokmi
description: Urban Velocity design system for a Malaysian mobility demo
colors:
  night: "#101412"
  surface: "#19201C"
  raised: "#222B25"
  text: "#F5F7F2"
  secondary-text: "#A8B3AB"
  muted-text: "#9AA69D"
  border: "#333E36"
  velocity-lime: "#C8FF3D"
  offer-orange: "#FF7448"
  success: "#64D99B"
  error: "#FF8585"
  daylight: "#F5F7F2"
  daylight-accent: "#466B00"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: 1.02
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "42px"
    fontWeight: 600
    lineHeight: 1.12
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "23px"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  input: "9px"
  panel: "16px"
  sheet: "20px"
spacing:
  compact: "10px"
  card-gap: "18px"
  panel-padding: "24px"
components:
  button-primary:
    backgroundColor: "{colors.velocity-lime}"
    textColor: "#14200C"
    rounded: "{rounded.input}"
    padding: "15px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.input}"
    padding: "15px 20px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "24px"
---

# Design System: UberPokmi

## Overview

**Creative North Star: "Urban Velocity"**

The interface behaves like a useful city tool after dark: immediate route and order decisions, legible status, and one unmistakable action per step. The bright accent marks action and progress; food photography keeps its natural colour. Desktop uses a fixed service rail while mobile shifts to a bottom navigation and a map-first booking sheet.

**Key Characteristics:**
- Dark tonal surfaces with lime reserved for decisive actions.
- Geometric headlines paired with restrained, readable interface copy.
- Realistic representative food photography and clearly fictional mobility assets.
- Route, price, status, and receipt stay visible at the moment they matter.

## Colors

Velocity Lime is the primary action colour on the Night, Surface, and Raised neutral stack. Offer Orange marks promotions; Success and Error communicate state. Daylight mode uses a deeper green accent to preserve contrast on light surfaces.

**The Action Signal Rule.** Reserve lime for selected options, progress and primary actions; do not tint food images or fill every panel with it.

## Typography

Space Grotesk carries the wordmark, page headlines and service names. Inter carries body copy, fields and operational labels. Headlines have tight spacing; transaction copy uses a more open line height. Keep action labels and essential mobile metadata readable at small widths.

**The Scan First Rule.** A user should find the next action, current price and current status without reading a paragraph.

## Layout

The desktop shell uses a fixed 232px sidebar and a content area capped at 1530px, with 42px horizontal padding. Primary service cards form a three-column grid, with Ride slightly wider. At 767px and below, the sidebar gives way to a fixed four-item bottom navigation; service cards form a two-column grid with Ride spanning both columns. Booking becomes a full-width map above a sheet. The 1250px, 1000px, 767px and 380px rules handle progressive compression.

## Elevation & Depth

Depth comes mainly from the Night → Surface → Raised tonal layers and quiet borders, rather than stacked drop shadows. Route pins, the modal and the fixed navigation earn higher layering only when they need to remain usable.

## Shapes

Panels and service cards use softly rounded 16px corners. Inputs and buttons use tighter 9px corners. Mobile booking sheets use 20px top corners to signal a touch surface; markers and icon controls may be circular.

## Components

- **Primary button:** lime fill, dark text, compact lift on hover, visible focus outline; one leading transaction action per step.
- **Secondary button:** transparent fill and border for reversible or supporting actions.
- **Panel:** Surface fill, Border outline, consistent internal padding for forms, totals and account settings.
- **Service card:** image-led route into Ride, Food or Send; label, title and CTA remain readable over its artwork.
- **Category chip:** outlined by default and filled when selected.
- **Mobile navigation:** four persistent destinations; individual service flows keep their own back action.

## Do's and Don'ts

### Do
- Do show a clear demo status on fictional bookings and prices.
- Do preserve food photos' natural colours and their credited provenance.
- Do keep keyboard focus, error text and primary actions visible in both themes.

### Don't
- Don't imply real dispatch, GPS tracking, merchant fulfilment or payment.
- Don't add generic analytics cards to a booking task.
- Don't shrink critical mobile labels simply to fit a decorative composition.
