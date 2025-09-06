# 👽 Alien Invasion Test

A React-based web application for decoding and visualizing alien ship command centers from radar matrix data.

## 🌐 Live Demo

**Try it online:** [https://alien-invasion-test.netlify.app/](https://alien-invasion-test.netlify.app/)

## 📋 Problem Description

### The Alien Invasion Matrix Problem

Earth is under attack! The resistance has managed to scan the alien ships using an ultrasonic radar, revealing their shield layers as rectangular matrices. Each layer may contain one or more command centers, represented by alphabetic characters. Your mission is to decode the radar output and precisely target the center of each command center in every layer, giving humanity a fighting chance.

#### Story

After a massive attack, the mainframe that decodes radar results was destroyed. The world needs your help—the best hacker known—to process the radar data and provide the coordinates to strike back.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ComparisonView.tsx        # Compare input/output files
│   ├── DualFileUpload.tsx        # Upload files for testing
│   └── ResultsDisplay.tsx        # Display results and stats
├── hooks/               # Custom React hooks
│   ├── useAlienSolver.ts         # Matrix decoding logic
│   ├── useComparison.ts          # File comparison logic
│   └── useFileUpload.ts          # File upload handling
├── types/               # TypeScript type definitions
│   └── alien.ts                 # Core type definitions
├── utils/               # Utility functions & algorithms
│   ├── alienInvasionSolver.ts    # Core algorithm implementation
│   ├── comparisonUtils.ts        # File comparison utilities
│   ├── directions.ts             # Direction parsing utilities
│   ├── fileUtils.ts              # File reading/writing helpers
│   └── parseUtils.ts             # Input parsing utilities
├── data/                # Sample input/output files
│   ├── alien.in
│   └── alien.out
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── App.css              # App-specific styles
├── index.css            # Global styles
└── vite-env.d.ts        # Vite environment types
```

## 📊 Input Format

```
N
X Y Z
<row 1>
<row 2>
...
<row X>
... (repeat for N ships)
```

- **N**: Number of ships (1 ≤ N ≤ 30)
- For each ship:
  - **X**: Height of the matrix (4 ≤ X ≤ 100)
  - **Y**: Width of the matrix (4 ≤ Y ≤ 100)
  - **Z**: Scale factor for coordinates
  - Next X lines: Each line contains Y elements separated by spaces. Each element is a character matching `[a-zA-Z]` (command center) or any other character (treated as empty space).

### Example Input

```
2
4 5 10
A . . B .
. . . . .
C . D . .
. . . . .
6 6 5
. . X . . .
. Y Y Y . .
. Y . Y . .
. Y Y Y . .
. . . . . .
. . . . . .
```

## 📈 Expected Output

Each line contains the shoot sequence for a ship, listing all command centers found, separated by spaces, in depth order. For each center: `(W:Px,Py[;s])+` where:

- **W**: Name of the command center
- **Px, Py**: Central coordinates (scaled and rounded to 3 digits)
- Multiple centers in a layer: separated by `;`, sorted by area (ascending) and then alphabetically

### Example Output

```
A:5.000,5.000 B:35.000,5.000 C:5.000,25.000 D:25.000,25.000
X:10.000,10.000 Y:15.000,15.000
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.13 + DaisyUI 5.1.7
- **Development**: ESLint with TypeScript support
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JD154/alien-invasion-test.git

# Navigate to project directory
cd alien-invasion-test

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
