# CostOptimizer AI Agent - Design System

## Overview
The CostOptimizer AI Agent features a modern minimal design system focused on clarity, elegance, and user experience. The design emphasizes clean typography, thoughtful spacing, and subtle visual effects that enhance usability without being distracting.

## Design Principles

### 1. Modern Minimalism
- Clean, uncluttered interfaces
- Generous white space
- Focus on content hierarchy
- Subtle visual elements

### 2. Glassmorphism & Depth
- Semi-transparent backgrounds with backdrop blur
- Layered depth with shadows and borders
- Soft, rounded corners (24px+ border radius)
- Gradient accents for visual interest

### 3. Purposeful Animation
- Smooth transitions (200-300ms)
- Fade-in animations for content loading
- Hover states with gentle transforms
- Typing indicators with custom animations

## Color Palette

### Primary Colors
- **Indigo**: `#6366f1` (primary actions, branding)
- **Purple**: `#9333ea` (gradients, accents)
- **Gray**: `#6b7280` (text, neutral elements)

### Status Colors
- **Success**: `#10b981` (emerald)
- **Warning**: `#f59e0b` (amber)
- **Error**: `#ef4444` (red)

### Semantic Usage
- **User messages**: Indigo to purple gradient
- **AI responses**: White with subtle borders
- **Interactive elements**: Gradient backgrounds with glow effects

## Typography

### Font Family
- **Primary**: Inter (web font)
- **Fallback**: System UI stack

### Scale
- **Headings**: 2xl-4xl with bold weight
- **Body**: Base size (16px) with relaxed leading
- **Captions**: Small size (14px) with medium weight
- **Labels**: Extra small (12px) with semibold weight

## Components

### 1. Chat Bubbles
- **User**: Gradient background, white text, 24px radius
- **Agent**: White background, gray text, subtle border
- **Avatar**: Gradient circular badges with glow effects

### 2. Deck Cards
- **Background**: White with 95% opacity, backdrop blur
- **Border**: 32px radius with gradient hover effects
- **Progress**: Animated indicators with gradient fills
- **Navigation**: Rounded buttons with hover transforms

### 3. Input Elements
- **Text areas**: 24px radius, focus rings with color
- **Buttons**: Gradient backgrounds, shadow effects
- **States**: Clear disabled, loading, and active states

### 4. Banners
- **Warning**: Amber gradient with glow icon
- **Error**: Red gradient with enhanced styling
- **Animations**: Fade-in from top with backdrop blur

## Spacing System

### Base Units
- **4px**: Micro spacing (gaps, padding)
- **8px**: Small spacing (icon margins)
- **16px**: Medium spacing (component padding)
- **24px**: Large spacing (section gaps)
- **32px**: Extra large (container margins)

### Responsive Breakpoints
- **Mobile**: < 640px (compact spacing, single column)
- **Tablet**: 640px - 1024px (medium spacing)
- **Desktop**: > 1024px (generous spacing, multi-column)

## Animations

### Timing Functions
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` (200ms)
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (300ms)
- **Smooth**: Custom easing for gentle effects

### Animation Types
- **Fade in up**: Content loading (600ms)
- **Scale in**: Modal/tooltip appearance (400ms)
- **Typing dots**: Loading indicators (1400ms loop)
- **Hover lift**: Interactive elements (-2px transform)

## Interactive States

### Hover Effects
- **Buttons**: Background color shift + shadow increase
- **Cards**: Elevation change (-4px transform)
- **Icons**: Scale increase (1.05x) + color shift

### Focus States
- **Inputs**: 4px ring with primary color at 10% opacity
- **Buttons**: Outline with offset for accessibility
- **Cards**: Subtle glow effect

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Interactive elements have clear visual focus
- Error states use both color and iconography

### Motion
- Reduced motion support via CSS media queries
- Optional animation disabling for sensitive users
- Smooth transitions that don't cause distraction

## Implementation Notes

### CSS Variables
Custom properties defined in `globals.css` for consistent theming:
```css
--color-primary: #6366f1;
--radius: 16px;
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Utility Classes
Tailwind CSS extended with custom utilities:
- `.card`: Base card styling with background and shadow
- `.btn-primary`: Primary button with gradient and effects
- `.animate-fade-in-up`: Content loading animation
- `.text-balance`: Better text wrapping for headings

### Component Structure
- Consistent prop interfaces across components
- TypeScript for type safety and better DX
- Modular design for easy maintenance and updates

## Future Enhancements

### Dark Mode
- Toggle between light and dark themes
- Adjusted opacity values for dark backgrounds
- Inverted color schemes while maintaining accessibility

### Micro-interactions
- Button click feedback with scale animations
- Loading states with skeleton screens
- Success confirmations with checkmark animations

### Advanced Theming
- Color customization options
- Font size preferences
- Animation speed controls 