<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MindTrace Project Documentation

## Project Overview
MindTrace is a longitudinal cognitive assessment and predictive risk platform built with Next.js 16, Tailwind CSS v4, and Supabase. The application focuses on daily cognitive testing with AI-powered trend analysis.

## Tech Stack
- **Framework**: Next.js 16.2.10 (App Router)
- **Styling**: Tailwind CSS v4 with custom theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF for medical report exports
- **AI**: Groq SDK for predictive analytics

## Build Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Environment Setup
1. Copy `.env.local.example` to `.env.local`
2. Set up Supabase project and configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Set Groq API key for AI features:
   - `GROQ_API_KEY`
4. Run the Supabase schema from `supabase-schema.sql` in your Supabase SQL editor

## Database Schema
The database schema is defined in `supabase-schema.sql` and includes:
- `profiles` - User profiles extending auth.users
- `test_results` - Cognitive test results with timing data
- `user_streaks` - Daily streak tracking
- `user_badges` - Gamification badges
- `test_categories` - CMS: Test categories
- `test_questions` - CMS: Test questions
- `question_options` - CMS: Question answer options
- `content_versions` - CMS: Content versioning

## Key Design System Colors
- **Cream Base**: #FDFBF7 (Primary background)
- **Slate Blue**: #4A6C7C (Primary actions)
- **Sage**: #7A9A7D (Positive status, streaks)
- **Zone Green**: #528359 (Stable cognitive zone)
- **Zone Yellow**: #C89B3C (Caution zone)
- **Zone Red**: #C36055 (Alert zone)

## Typography
- **Font**: Nunito (rounded sans-serif)
- **Base Size**: 18px (text-lg)
- **Minimum Touch Target**: 48px x 48px
- **Button Height**: 56px (h-14)

## Route Structure
- `/` - Redirects to login
- `/login` - Authentication page
- `/dashboard` - Activity Hub (main dashboard)
- `/test/patterns` - Pattern recognition test
- `/analytics` - Longitudinal tracking and analytics
- `/admin/content` - Content management system
- `/chatbot` - Existing Groq chatbot (excluded from auth)

## Component Library
Located in `/components`:
- `Button` - Primary/secondary/sage/danger variants
- `Card` - Surface containers with hover states
- `Badge` - Status indicators (sage/blue/yellow/red)
- `Input` - Form inputs with error handling
- `StatusZone` - Health zone displays
- `Header` - Navigation with streak indicator

## Accessibility Requirements
- WCAG 2.1 AAA contrast compliance
- Minimum 18px body font size
- 48px minimum touch targets
- Full keyboard navigation support
- Screen reader support with ARIA labels
- No flashing animations or countdown timers

## Authentication Flow
1. User signs up/logs in via `/login`
2. Middleware protects routes (`/dashboard`, `/test`, `/analytics`, `/admin`)
3. Session managed via Supabase Auth
4. Profile automatically created on signup via database trigger

## MVP Features Implemented
- ✅ Supabase authentication with magic link and password
- ✅ Custom Tailwind CSS v4 theme with design system colors
- ✅ Activity Hub dashboard with streaks and badges
- ✅ Pattern recognition test workspace
- ✅ Basic analytics page with Recharts visualization
- ✅ Content management system for test questions
- ✅ Responsive header navigation
- ✅ Accessible component library

## Next Steps for Full Implementation
1. Implement remaining test types (Timed Puzzles, Animal/Tool ID)
2. Add real-time streak calculation and badge system
3. Implement PDF export with jsPDF
4. Add AI predictive model integration
5. Build notification system
6. Add settings page with user preferences
7. Implement audio assistance for tests
8. Add keyboard navigation to test workspace
9. Create onboarding flow for new users
10. Add data export and privacy features
