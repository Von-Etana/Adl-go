# ADLgo Design System

> **Comprehensive UI/UX Design System for Hybrid Logistics & Fintech Mobile Application**

## Visual Reference

The ADLgo design system is based on modern, minimalistic flat design principles with high attention to user experience and visual hierarchy.

![Reference Image 1](C:/Users/Stephen/.gemini/antigravity/brain/71a7690d-32df-4d9a-98f9-bde0a48fee70/uploaded_image_0_1764150185276.jpg)

![Reference Image 2](C:/Users/Stephen/.gemini/antigravity/brain/71a7690d-32df-4d9a-98f9-bde0a48fee70/uploaded_image_1_1764150185276.jpg)

![Reference Image 3](C:/Users/Stephen/.gemini/antigravity/brain/71a7690d-32df-4d9a-98f9-bde0a48fee70/uploaded_image_2_1764150185276.jpg)

![Reference Image 4](C:/Users/Stephen/.gemini/antigravity/brain/71a7690d-32df-4d9a-98f9-bde0a48fee70/uploaded_image_3_1764150185276.jpg)

![Reference Image 5](C:/Users/Stephen/.gemini/antigravity/brain/71a7690d-32df-4d9a-98f9-bde0a48fee70/uploaded_image_4_1764150185276.jpg)

---

## 1. Design Philosophy

### Core Principles
- **Flat Design**: Clean, 2D elements with minimal shadows
- **Minimalistic**: High whitespace utilization, uncluttered interfaces
- **Modern & Classy**: Professional aesthetic with subtle sophistication
- **User-Centric**: Intuitive navigation and clear visual hierarchy
- **Accessibility**: High contrast ratios and readable typography

---

## 2. Color Palette

### Primary Colors
```css
--primary-dark: #1A1A1A        /* Deep black for headers, primary text */
--primary-gray: #2D2D2D        /* Dark gray for cards, modals */
--primary-orange: #FF6B4A      /* Accent color for CTAs, highlights */
--primary-coral: #FF8566       /* Lighter orange for gradients */
```

### Secondary Colors
```css
--secondary-white: #FFFFFF     /* Pure white backgrounds */
--secondary-light-gray: #F5F5F5 /* Light gray backgrounds */
--secondary-medium-gray: #E0E0E0 /* Borders, dividers */
--secondary-text-gray: #757575  /* Secondary text, labels */
```

### Semantic Colors
```css
--success-green: #4CAF50       /* Success states, confirmations */
--warning-yellow: #FFC107      /* Warnings, pending states */
--error-red: #F44336           /* Errors, destructive actions */
--info-blue: #2196F3           /* Information, links */
```

### Gradient Definitions
```css
--gradient-orange: linear-gradient(135deg, #FF6B4A 0%, #FF8566 100%)
--gradient-card: linear-gradient(180deg, #FFFFFF 0%, #F9F9F9 100%)
--gradient-dark: linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)
```

### Color Usage Guidelines

| Element | Color | Usage |
|---------|-------|-------|
| Primary CTA Buttons | `--primary-orange` | Main action buttons (Pay Now, Continue, Accept) |
| Headers/Titles | `--primary-dark` | Screen titles, card headers |
| Body Text | `--primary-dark` | Primary readable content |
| Secondary Text | `--secondary-text-gray` | Labels, hints, timestamps |
| Backgrounds | `--secondary-white` | Main screen backgrounds |
| Cards/Modals | `--secondary-white` with subtle shadow | Elevated content containers |
| Borders | `--secondary-medium-gray` | Input fields, dividers |
| Icons (Active) | `--primary-dark` | Active navigation, interactive icons |
| Icons (Inactive) | `--secondary-text-gray` | Inactive states |

---

## 3. Typography

### Font Family
```css
--font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
--font-secondary: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
```

### Type Scale

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 32px | 700 (Bold) | 40px | Screen titles |
| **H2** | 24px | 600 (Semibold) | 32px | Section headers |
| **H3** | 20px | 600 (Semibold) | 28px | Card titles |
| **H4** | 18px | 600 (Semibold) | 24px | Subsection headers |
| **Body Large** | 16px | 400 (Regular) | 24px | Primary content |
| **Body** | 14px | 400 (Regular) | 20px | Standard text |
| **Body Small** | 12px | 400 (Regular) | 18px | Secondary text, labels |
| **Caption** | 11px | 400 (Regular) | 16px | Timestamps, hints |
| **Button** | 16px | 600 (Semibold) | 24px | Button labels |
| **Input** | 16px | 400 (Regular) | 24px | Input field text |

### Typography Guidelines
- **Letter Spacing**: -0.5px for headers, 0px for body text
- **Text Alignment**: Left-aligned for readability, center for CTAs
- **Max Line Length**: 60-80 characters for optimal readability
- **Contrast Ratio**: Minimum 4.5:1 for body text, 3:1 for large text

---

## 4. Spacing System

### Base Unit: 4px

```css
--space-1: 4px    /* Micro spacing */
--space-2: 8px    /* Small spacing */
--space-3: 12px   /* Medium-small spacing */
--space-4: 16px   /* Medium spacing (default) */
--space-5: 20px   /* Medium-large spacing */
--space-6: 24px   /* Large spacing */
--space-8: 32px   /* Extra large spacing */
--space-10: 40px  /* Section spacing */
--space-12: 48px  /* Major section spacing */
```

### Spacing Usage

| Context | Spacing | Value |
|---------|---------|-------|
| Screen Padding (Horizontal) | `--space-4` | 16px |
| Screen Padding (Vertical) | `--space-6` | 24px |
| Card Padding | `--space-4` | 16px |
| Element Margin (Small) | `--space-2` | 8px |
| Element Margin (Medium) | `--space-4` | 16px |
| Element Margin (Large) | `--space-6` | 24px |
| Section Gap | `--space-8` | 32px |
| Input Field Padding | `--space-4` | 16px |
| Button Padding (Vertical) | `--space-4` | 16px |
| Button Padding (Horizontal) | `--space-6` | 24px |

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button
```typescript
// Large Primary Button (CTA)
{
  backgroundColor: '#1A1A1A',
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  height: 56,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2
}

// Text Style
{
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
  letterSpacing: 0.5
}
```

#### Secondary Button (Light)
```typescript
{
  backgroundColor: '#F5F5F5',
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  height: 56,
  justifyContent: 'center',
  alignItems: 'center'
}

// Text Style
{
  color: '#1A1A1A',
  fontSize: 16,
  fontWeight: '600'
}
```

#### Button States
- **Default**: Full opacity, defined colors
- **Pressed**: 90% opacity
- **Disabled**: 40% opacity, no interaction
- **Loading**: Show activity indicator, disable interaction

### 5.2 Cards

#### Standard Card
```typescript
{
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2
}
```

#### Elevated Card (Modal/Bottom Sheet)
```typescript
{
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 5
}
```

#### Selection Card (with border highlight)
```typescript
// Default State
{
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: '#E0E0E0'
}

// Selected State
{
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  borderWidth: 2,
  borderColor: '#1A1A1A'
}
```

### 5.3 Input Fields

#### Text Input
```typescript
{
  backgroundColor: '#F5F5F5',
  borderRadius: 12,
  paddingVertical: 16,
  paddingHorizontal: 16,
  fontSize: 16,
  color: '#1A1A1A',
  borderWidth: 1,
  borderColor: 'transparent'
}

// Focused State
{
  borderColor: '#1A1A1A',
  backgroundColor: '#FFFFFF'
}

// Error State
{
  borderColor: '#F44336',
  backgroundColor: '#FFF5F5'
}
```

#### Search Input
```typescript
{
  backgroundColor: '#F5F5F5',
  borderRadius: 24,
  paddingVertical: 12,
  paddingHorizontal: 16,
  paddingLeft: 44, // Space for search icon
  fontSize: 14,
  color: '#1A1A1A'
}
```

### 5.4 Navigation

#### Bottom Navigation Bar
```typescript
{
  backgroundColor: '#1A1A1A',
  height: 80,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingBottom: 8, // Safe area padding
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24
}

// Nav Item (Active)
{
  icon: { color: '#FFFFFF', size: 24 },
  label: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' }
}

// Nav Item (Inactive)
{
  icon: { color: '#757575', size: 24 },
  label: { color: '#757575', fontSize: 11, fontWeight: '400' }
}
```

#### Top Navigation Header
```typescript
{
  backgroundColor: '#FFFFFF',
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#F5F5F5'
}

// Title Style
{
  fontSize: 18,
  fontWeight: '600',
  color: '#1A1A1A'
}
```

### 5.5 Chips & Tags

#### Filter Chip
```typescript
// Default State
{
  backgroundColor: '#F5F5F5',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  marginRight: 8
}

// Selected State
{
  backgroundColor: '#1A1A1A',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  marginRight: 8
}
```

#### Status Badge
```typescript
// Transit Status
{
  backgroundColor: '#FFF3E0',
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 12
}
// Text: { color: '#FF6B4A', fontSize: 11, fontWeight: '600' }

// Delivered Status
{
  backgroundColor: '#E8F5E9',
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 12
}
// Text: { color: '#4CAF50', fontSize: 11, fontWeight: '600' }
```

### 5.6 Icons & Illustrations

#### Icon Specifications
- **Size Scale**: 16px (small), 20px (medium), 24px (large), 32px (extra-large)
- **Style**: Outline/stroke-based icons (2px stroke weight)
- **Color**: Inherit from parent or use semantic colors
- **Spacing**: 8px minimum clearance around icons

#### 3D Vehicle Icons
- **Style**: Isometric 3D illustrations
- **Size**: 80x80px for selection cards
- **Vehicles**: Bike, Car, Van, Truck
- **Color Scheme**: Realistic colors with subtle shadows

#### Flat Illustrations
- **Usage**: Onboarding screens, empty states
- **Style**: Flat 2D with subtle gradients
- **Color Palette**: Match brand colors
- **Size**: Full-width for onboarding (300-400px height)

---

## 6. Layout Patterns

### 6.1 Screen Layouts

#### Standard Screen
```
┌─────────────────────────┐
│ Header (56px)           │
├─────────────────────────┤
│                         │
│ Content Area            │
│ (Scrollable)            │
│ Padding: 16px           │
│                         │
│                         │
├─────────────────────────┤
│ Bottom Nav (80px)       │
└─────────────────────────┘
```

#### Modal/Bottom Sheet
```
┌─────────────────────────┐
│                         │
│ Dimmed Background       │
│ (opacity: 0.5)          │
│                         │
├─────────────────────────┤
│ ╭─────────────────────╮ │
│ │ Handle Bar (4x40px) │ │
│ │ Title               │ │
│ │ Content             │ │
│ │ Action Buttons      │ │
│ ╰─────────────────────╯ │
└─────────────────────────┘
```

### 6.2 Grid System

- **Columns**: 12-column grid
- **Gutter**: 16px
- **Margin**: 16px (mobile), 24px (tablet)
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px (web admin)

---

## 7. Interaction Patterns

### 7.1 Animations

#### Transition Timings
```css
--duration-fast: 150ms      /* Quick feedback */
--duration-normal: 250ms    /* Standard transitions */
--duration-slow: 350ms      /* Complex animations */
--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1)
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1)
```

#### Common Animations
- **Button Press**: Scale down to 0.95, duration 150ms
- **Card Tap**: Opacity 0.7, duration 150ms
- **Modal Enter**: Slide up from bottom, duration 350ms
- **Screen Transition**: Slide horizontal, duration 250ms
- **Loading Pulse**: Opacity 0.5-1.0, duration 1000ms, infinite

### 7.2 Gestures

| Gesture | Action | Feedback |
|---------|--------|----------|
| Tap | Select/Activate | Visual highlight + haptic |
| Long Press | Show context menu | Haptic + menu appear |
| Swipe Left | Navigate back | Screen slide |
| Swipe Down | Refresh content | Pull-to-refresh indicator |
| Pinch | Zoom map | Smooth scale transform |
| Pan | Move map | Real-time position update |

### 7.3 Feedback Mechanisms

- **Haptic Feedback**: Light impact for taps, medium for success, heavy for errors
- **Visual Feedback**: Color change, opacity, scale
- **Toast Notifications**: Bottom toast (56px height), auto-dismiss after 3s
- **Loading States**: Skeleton screens for content, spinners for actions

---

## 8. Iconography

### Icon Library
**Primary**: Lucide React Native (consistent stroke-based icons)

### Icon Usage

| Context | Icon | Size | Color |
|---------|------|------|-------|
| Navigation (Active) | Filled variant | 24px | `#FFFFFF` |
| Navigation (Inactive) | Outline variant | 24px | `#757575` |
| Action Buttons | Outline | 20px | `#1A1A1A` |
| Input Fields | Outline | 20px | `#757575` |
| Status Indicators | Filled | 16px | Semantic color |
| List Items | Outline | 20px | `#1A1A1A` |

### Custom Icons Needed
- **3D Vehicle Icons**: Bike, Car, Van, Truck (isometric view)
- **Payment Logos**: Mastercard, Visa, PayPal, Apple Pay
- **Bill Payment Logos**: MTN, Airtel, DSTV, GOTV, Electricity providers

---

## 9. Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text (18px+)**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio

#### Touch Targets
- **Minimum Size**: 44x44px for all interactive elements
- **Spacing**: 8px minimum between adjacent touch targets

#### Screen Reader Support
- **Labels**: All interactive elements have accessible labels
- **Hints**: Provide context for complex interactions
- **Announcements**: Dynamic content changes announced

#### Keyboard Navigation
- **Focus Indicators**: Clear visual focus states
- **Tab Order**: Logical navigation flow
- **Shortcuts**: Common actions accessible via keyboard

---

## 10. Platform-Specific Guidelines

### iOS Considerations
- **Safe Area**: Respect notch and home indicator
- **Navigation**: Use native iOS navigation patterns
- **Haptics**: Leverage iOS haptic engine
- **Fonts**: Use SF Pro Display/Text

### Android Considerations
- **Material Design**: Adapt elevation and shadows
- **Navigation**: Support Android back button
- **Ripple Effects**: Use native ripple feedback
- **Fonts**: Use Roboto as fallback

---

## 11. Design Tokens (React Native)

```typescript
// tokens.ts
export const colors = {
  primary: {
    dark: '#1A1A1A',
    gray: '#2D2D2D',
    orange: '#FF6B4A',
    coral: '#FF8566',
  },
  secondary: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    mediumGray: '#E0E0E0',
    textGray: '#757575',
  },
  semantic: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
```

---

## 12. Component Implementation Examples

### Example: Primary Button Component

```typescript
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.secondary.white : colors.primary.dark} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primary.dark,
    ...shadows.md,
  },
  secondaryButton: {
    backgroundColor: colors.secondary.lightGray,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    ...typography.button,
  },
  primaryText: {
    color: colors.secondary.white,
  },
  secondaryText: {
    color: colors.primary.dark,
  },
});
```

---

## 13. Quality Checklist

Before shipping any screen, verify:

- [ ] All colors use design tokens (no hardcoded values)
- [ ] Typography follows type scale
- [ ] Spacing uses 4px base unit
- [ ] Touch targets are minimum 44x44px
- [ ] Color contrast meets WCAG AA standards
- [ ] Animations use standard durations and easing
- [ ] Loading and error states are designed
- [ ] Safe area insets are respected (iOS)
- [ ] Dark mode support (if applicable)
- [ ] Responsive layout for different screen sizes
- [ ] Accessibility labels are present
- [ ] Haptic feedback is implemented

---

## 14. Resources & Assets

### Required Asset Deliverables

#### 3D Vehicle Icons
- `bike-3d.png` (80x80px, 160x160px @2x, 240x240px @3x)
- `car-3d.png` (80x80px, 160x160px @2x, 240x240px @3x)
- `van-3d.png` (80x80px, 160x160px @2x, 240x240px @3x)
- `truck-3d.png` (80x80px, 160x160px @2x, 240x240px @3x)

#### Onboarding Illustrations
- `onboarding-delivery.png` (Full width, 300px height)
- `onboarding-wallet.png` (Full width, 300px height)
- `onboarding-tracking.png` (Full width, 300px height)

#### Payment Provider Logos
- Official brand logos for: Mastercard, Visa, PayPal, Apple Pay
- Official logos for: MTN, Airtel, DSTV, GOTV, Ikeja Electric

#### App Icon & Splash
- App icon (1024x1024px, rounded corners)
- Splash screen (various sizes for iOS/Android)

---

## Conclusion

This design system ensures consistency, scalability, and a premium user experience across the ADLgo platform. All components should strictly adhere to these guidelines to maintain visual coherence and brand identity.

For implementation questions or design clarifications, refer to the reference images and this documentation.
