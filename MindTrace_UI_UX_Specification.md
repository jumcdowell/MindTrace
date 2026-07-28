# UI/UX Specification Document: MindTrace

**Product Title:** MindTrace — Longitudinal Cognitive Assessment & Predictive Risk Platform  
**Document Version:** 1.0  
**Target Platform:** Web Application (Desktop-First Responsive)  
**CSS Framework:** Tailwind CSS v4  
**Design Aesthetic:** Softer Palette (Warm Cream, Muted Sage Green, Serene Slate Blue)  
**Primary User:** Patients / Individuals (Self-operated with Medical Export capability)  

---

## 1. Executive Summary & Product Vision

### 1.1 The Core Problem
Dementia and cognitive decline affect millions worldwide, developing subtly over many years. Traditional clinical evaluations—such as the Mini-Mental State Examination (MMSE), Montreal Cognitive Assessment (MoCA), or ADAS-Cog—occur sporadically in clinical settings. Consequently, physicians must interpret years of sparse data, making it extremely difficult to identify early micro-trends. Early intervention yields the highest quality-of-life retention, yet early subtle signs are frequently missed.

### 1.2 The Solution
MindTrace provides an approachable, daily web application featuring engaging micro-activities (timed puzzles, pattern recognition, spatial memory, tool and animal identification). Over time, longitudinal data gathered from daily interactions feeds a predictive AI model that forecasts early risk trajectories (e.g., *"Based on longitudinal cognitive assessment patterns, there is a 78% probability of noticeable cognitive score decline over the next 12 months"*).

### 1.3 Key UX Philosophy & Principles
* **Anxiety-Free Daily Testing:** The patient receives immediate encouraging, non-stressful completion feedback after every test. Numerical raw scores, latency graphs, and risk analytics are segregated in the dedicated **Tracking Page** to prevent test anxiety.
* **Warm, Gentle Aesthetic:** Soft cream, muted sage, and serene slate blue replace cold, intimidating clinical whites and harsh blues, creating a comforting environment for daily use.
* **Accessible & Highly Legible:** Designed for optimal usability by aging adults, featuring large touch targets, high-contrast typography (minimum 18px body font), clear focus indicators, and optional audio assistance.
* **Self-Operated with Clinical Export:** Empowers patients to complete daily routines independently while providing robust, one-click PDF export tools formatted specifically for physicians and caregivers.

---

## 2. Design System & Theme Specifications (Tailwind CSS v4)

### 2.1 Color Palette Configuration

The design system uses soft, muted colors inspired by cream, sage, and serene slate blue.

```css
/* Tailwind CSS v4 Theme Variables Specification */
@theme {
  /* Canvas & Surface Colors */
  --color-cream-base: #FDFBF7;      /* Warm primary page background */
  --color-cream-surface: #F5F1E8;   /* Card / container backgrounds */
  --color-cream-border: #E8E2D5;    /* Soft dividers and subtle borders */
  --color-cream-card-hover: #ECE6D9;/* Interactive card hover state */

  /* Brand & Action Colors */
  --color-slate-blue: #4A6C7C;     /* Primary buttons, active tabs, header */
  --color-slate-blue-hover: #3B5765;/* Hover state for primary actions */
  --color-slate-blue-light: #E8EEF1;/* Soft background accent */
  --color-sage: #7A9A7D;           /* Positive status, streaks, completion */
  --color-sage-hover: #658368;     /* Hover state for sage elements */
  --color-sage-light: #E9F0E9;     /* Soft background highlight for badges */

  /* Health & Risk Status Zones */
  --color-zone-green: #528359;     /* Stable / Baseline Normal */
  --color-zone-green-bg: #EAF2EB;  /* Green zone background fill */
  --color-zone-yellow: #C89B3C;    /* Mild Fluctuation / Caution */
  --color-zone-yellow-bg: #FCF6E8; /* Yellow zone background fill */
  --color-zone-red: #C36055;       /* Persistent Decline Trend / Alert */
  --color-zone-red-bg: #FDF0EE;    /* Red zone background fill */

  /* Neutral & Typography */
  --color-text-main: #2C3338;      /* Primary readable body text */
  --color-text-muted: #6B7280;     /* Secondary subtitles & metadata */
  --color-text-inverted: #FFFFFF;  /* Text on dark buttons */
}
```

### 2.2 Typography & Scale
* **Primary Font Family:** Rounded Sans-Serif (`Inter`, `Nunito`, or `Outfit`) for high legibility and warmth.
* **Base Typography Scale:**
  * **Body Text:** `18px` (`1.125rem` / `text-lg`), line-height `1.6` (`leading-relaxed`).
  * **Subtitles / Card Headers:** `22px` (`1.375rem` / `text-xl`), font weight `600`.
  * **Section Headings (H2):** `28px` (`1.75rem` / `text-2xl`), font weight `700`.
  * **Page Titles (H1):** `36px` (`2.25rem` / `text-4xl`), font weight `800`.
* **Interactive Element Dimensions:**
  * **Primary Buttons:** Minimum height `56px` (`h-14`), padding horizontal `24px` (`px-6`), font size `18px` (`text-lg`), rounded borders (`rounded-xl`).
  * **Touch/Click Targets:** Minimum clickable area `48px x 48px` to accommodate fine motor variations.

---

## 3. Site Architecture & Global Layout Structure

### 3.1 Persistent Header Navigation
The desktop header remains persistent across non-test views, establishing quick navigation and progress awareness.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🧠 MindTrace     [🔥 12-Day Streak]    Daily Hub    Tracking & Analytics   Alerts (1)   [Profile] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Left:** App Logo (Serene Slate Blue icon + brand text).
* **Center-Left:** Daily Streak Indicator (`🔥 12-Day Streak` in Sage Green pill container).
* **Center-Right Navigation Tabs:**
  * **Daily Hub** (Active view indicator)
  * **Tracking & Analytics**
  * **Notification Center** (With subtle badge count)
* **Right:** User Profile / Settings Avatar Menu.

---

## 4. Page-by-Page Detailed UI/UX Specifications

### 4.1 Authentication & Onboarding Page
* **Purpose:** Frictionless, low-cognitive-load account access.
* **Layout Structure:** Single centered card on `--color-cream-base` background.
* **UI Components:**
  * Brand Header: Soft brain/pathway icon in Slate Blue with welcoming subtitle.
  * Form Options:
    * One-click "Magic Link to Email" (Primary recommended path).
    * Standard Email / Password fields with large toggleable "Show Password" button.
    * Passkey / Biometric login support.
* **UX Safety & Accessibility:** Clear inline error messages in soft rosewood, minimum `56px` input field heights with large font sizing (`18px`).

---

### 4.2 Activity Hub (Home Dashboard)
* **Purpose:** Daily launchpad for activities, habit building, and positive encouragement.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HERO BANNER                                                                            │
│ "Good morning, Arthur! Ready for today's 3-minute brain refresh?"                       │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🌟 RECOMMENDED TODAY: Pattern Match & Animal Identification (Est. 3 mins)        │  │
│  │ [ START TODAY'S ROUTINE ] (Large Slate Blue Button, h-14)                         │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│ REWARDS & RECOGNITION                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │ 🔥 12-Day Streak       │  │ 🏅 Pattern Master      │  │ 🎯 50 Tests Completed  │  │
│  │ Active Routine         │  │ Unlocked Yesterday     │  │ Milestone Badge        │  │
│  └────────────────────────┘  └────────────────────────┘  └────────────────────────┘  │
│                                                                                        │
│ EXPLORE ALL TEST CATEGORIES                                                            │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 🧩 Timed Puzzles     │  │ 🎨 Pattern           │  │ 🐘 Animal & Tool ID  │          │
│ │ Speed & Logic        │  │ Visual-Spatial       │  │ Memory & Naming      │          │
│ │ [ Start Puzzle ]     │  │ [ Start Patterns ]   │  │ [ Start ID Test ]    │          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Key Sections:**
  1. **Greeting & Recommended Routine Hero:** Personalized greeting, clear time commitment ("Est. 3 mins"), and a prominent "Start Today's Routine" primary CTA button.
  2. **Reward Strip:** Displays earned badges, active streaks, and milestone icons to encourage engagement.
  3. **Activity Grid:** 3 main test category cards (Timed Puzzles, Pattern Recognition, Animal & Tool ID) with vector illustrations, brief description, duration tag, and direct launch buttons.

---

### 4.3 Interactive Test Workspace (The "North Star" Experience)
* **Purpose:** Distraction-free, anxiety-free execution of cognitive micro-tasks.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [ ← Exit Activity ]                 Question 3 of 5                 [ 🔊 Audio Prompt ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│                    Identify which tool matches the shape on the left:                   │
│                                                                                        │
│              ┌────────────┐        ┌────────────┐        ┌────────────┐                │
│              │  OPTION A  │        │  OPTION B  │        │  OPTION C  │                │
│              │  [ Image ] │        │  [ Image ] │        │  [ Image ] │                │
│              └────────────┘        └────────────┘        └────────────┘                │
│                                                                                        │
│                                      [ NEXT QUESTION ]                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **UI Rules & Interaction Details:**
  * **Minimal Header:** Main navbar is hidden. Displays only a gentle exit button, step indicator ("Question 3 of 5"), and an audio toggle button.
  * **No Ticking Clock:** Even though response latency is recorded in the background for clinical analysis, **no live countdown timer is displayed** on screen to prevent stress.
  * **Large Interactive Cards:** Options rendered as large clickable cards (`min-h-[120px]`) with prominent borders that highlight in Sage Green when selected.
  * **Audio Readout:** Hovering or clicking `[ 🔊 Audio Prompt ]` reads question text aloud.

---

### 4.4 Post-Test Reassurance Screen
* **Purpose:** Provide immediate, uplifting feedback without showing potentially alarming numbers.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                     🌟 WONDERFUL JOB! 🌟                               │
│                                                                                        │
│                    Your test answers have been saved to your health log.               │
│                  Daily exercises keep your mind engaged and active.                    │
│                                                                                        │
│                              🏆 NEW BADGE UNLOCKED! 🏆                                  │
│                               "5-Day Streak Explorer"                                  │
│                                                                                        │
│                 [ BACK TO DAILY HUB ]         [ VIEW DETAILED RESULTS ]                │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **UX Intent:** Never show raw accuracy percentages, response latency metrics, or risk flags on this screen. Provide encouraging feedback first, giving the user full agency to click `[ View Detailed Results ]` if they wish to inspect their Tracking page.

---

### 4.5 Longitudinal Analytics & Tracking Page
* **Purpose:** Core diagnostic and trends dashboard where actual numerical scores, historical graphs, health status zones, and predictive AI model outputs are visualized.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ANALYTICS & LONGITUDINAL TRACKING                   [ 📄 Export Report for Doctor ]     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PREDICTIVE HEALTH TRAJECTORY                                                           │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │  Overall Cognitive Score Trajectory over 12 Months                                 │ │
│ │  [ Legend: ── Baseline Score    ── Actual Test Averages   ┄┄ AI 12-Mo Forecast ]    │ │
│ │                                                                                    │ │
│ │  100 |──────────────────────────╭──────╮                                          │ │
│ │   80 |──────────╭───────────────╯      ╰───────- - - - - - (Green Zone)            │ │
│ │   60 |──────────╯                                          - - (Yellow Zone)       │ │
│ │   40 |                                                         (Red Zone)          │ │
│ │      └───Jan───Feb───Mar───Apr───May───Jun───Jul───Aug───Sep───Oct───Nov───Dec────   │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ STATUS ZONE SUMMARY                                                                    │
│ ┌───────────────────────────────────┐  ┌─────────────────────────────────────────────┐ │
│ │ 🟢 GREEN ZONE: STABLE             │  │ 🤖 AI PREDICTIVE RISK MODEL EVALUATION     │ │
│ │ Score variance within baseline    │  │ "Based on 12 months of test data, there     │ │
│ │ normal range over past 90 days.   │  │ is an 82% likelihood of cognitive stability │ │
│ │                                   │  │ over the next 12 months."                   │ │
│ └───────────────────────────────────┘  └─────────────────────────────────────────────┘ │
│                                                                                        │
│ SKILL CATEGORY BREAKDOWN & RAW METRICS                                                 │
│ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐ │
│ │ 🧩 Timed Puzzles  │ │ 🎨 Patterns       │ │ 🐘 Animal ID      │ │ 🔧 Tool ID       │ │
│ │ Score: 88 / 100   │ │ Score: 92 / 100   │ │ Score: 95 / 100   │ │ Score: 81 / 100  │ │
│ │ Avg Time: 2.1s    │ │ Avg Time: 1.8s    │ │ Avg Time: 1.4s    │ │ Avg Time: 2.9s   │ │
│ │ Status: Stable    │ │ Status: +4% Trend │ │ Status: Stable    │ │ Status: -2% Var. │ │
│ └───────────────────┘ └───────────────────┘ └───────────────────┘ └──────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Key Components & Layout Rules:**
  1. **Export CTA Header:** Prominent button at top right (`[ 📄 Export Report for Doctor ]`) to trigger printable PDF compilation.
  2. **Predictive Health Trajectory Chart:**
     * Built with Recharts / Chart.js using custom theme colors.
     * Horizontal background shading representing health status zones:
       * **Green Zone (Top 75–100%):** `--color-zone-green-bg`
       * **Yellow Zone (Middle 50–74%):** `--color-zone-yellow-bg`
       * **Red Zone (Bottom 0–49%):** `--color-zone-red-bg`
     * Solid line for historical assessment data, dashed line for AI 12-month forward predictive trajectory.
  3. **Status Zone Summary & AI Evaluation Card:**
     * Clear status badge (e.g., `🟢 Green Zone: Stable`).
     * Direct plain-language AI risk model output statement.
  4. **Skill Category Metric Cards:** Detailed breakdown displaying actual numerical accuracy, response latency (in seconds), and short-term trend variance for each assessment activity.

---

### 4.6 Notification Center
* **Purpose:** Deliver timely updates regarding test schedules, score trends, and physician report reminders in a calm tone.
* **Notification Card Examples:**
  * **Routine Reminder:** *"Good morning! Your 3-minute daily cognitive exercise is ready."*
  * **Milestone Alert:** *"Congratulations! You've unlocked the 10-Day Consistency Badge."*
  * **Trend Variance Notice (Calm & Non-Alarmist):** *"We noticed a slight variance in reaction times over your last 3 pattern activities. You may want to include these insights in your next routine report for your physician."* `[ View Trend Data ]` `[ Generate Report ]`

---

### 4.7 Account Settings & Medical PDF Exporter
* **Purpose:** Manage patient credentials and export formatted clinical summaries.
* **Export PDF Generator Features:**
  * Generates a clean 2-page medical summary including:
    * Patient Demographics & Baseline MoCA/MMSE clinical scores (if entered).
    * 30-Day, 90-Day, and 12-Month score trajectory charts.
    * Specific sub-domain performance breakdown (Processing Speed, Visual-Spatial, Naming & Recall).
    * AI Predictive Risk Model evaluation summary notes.
    * Blank section for physician clinical notes and signature.

---

## 5. Gamification System & Badge Matrix

To maintain long-term user retention without trivializing the medical purpose of the platform, the app implements a thoughtful reward system:

| Reward Component | UI Element | Trigger Condition | UX Purpose |
| :--- | :--- | :--- | :--- |
| **Daily Streak Counter** | 🔥 Ember Pill Badge | Complete at least 1 test activity daily | Establishes daily cognitive health habit |
| **Streak Saver Shield** | 🛡️ Shield Icon | Allowed once per 14-day cycle | Prevents demotivation from missed days |
| **Pattern Master Badge** | 🏅 Gold/Sage Emblem | Complete 10 pattern recognition tasks | Positive reinforcement for visual skills |
| **Focus Explorer Badge** | 🌟 Star Emblem | Complete 50 total test activities | Milestone celebration for long-term use |
| **Morning Mind Badge** | 🌅 Sun Emblem | Complete activities before 10 AM for 5 days | Promotes consistent morning routines |

---

## 6. Accessibility, Usability & Technical Checklist

* **Color Contrast:** All text pairings satisfy WCAG 2.1 AAA contrast requirements (e.g., Charcoal text `#2C3338` on Warm Cream `#FDFBF7` exceeds 10:1 ratio).
* **Font Sizing:** Minimum body font size is `18px` with scalable `rem` units to respect browser zoom settings.
* **Interactive Target Size:** All buttons, cards, and input controls maintain a minimum target area of `56px` height and `48px` width.
* **Keyboard Accessibility:** Complete keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`) across all test choices and dashboard menus.
* **Screen Reader & Audio:** WAI-ARIA labels on all chart elements and image options, paired with built-in text-to-speech audio prompt toggles.
* **No Flashing/Sudden Animations:** Smooth, gentle CSS transitions (`duration-200 ease-in-out`), avoiding sudden flashes, ticking countdowns, or loud alarm audio effects.
