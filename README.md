# Calculator

A modern, responsive, and accessible web-based calculator built with HTML, CSS, and JavaScript.

This repository provides a lightweight, professional calculator UI that supports common arithmetic operations, memory functions, and a few additional math utilities. It also includes a smooth, animated starry background and a toggleable light/dark theme.

## Highlights
- Responsive layout with clean glass-style UI
- Light & dark theme toggle (persists with `localStorage`)
- Keyboard support (digits, operators, Enter, Backspace, Delete, Escape)
- Memory operations: `MC`, `MR`, `M+`, `M-`, `MS`, `M` (display)
- Utility functions: `%`, `1/x`, `x²`, `√x`, `±` and backspace (`DEL`)
- Animated starry background implemented with Canvas for lightweight visuals
- Accessibility improvements: ARIA attributes, focus styles, and readable font sizes

## Live Preview
Open `index.html` in your favorite browser. The application is purely static so no server is required, but running a small local HTTP server is recommended for a more accurate development environment.

## Getting Started (Development)
1. Clone or download the repository.
2. Open `index.html` directly or run a local web server.

Example using Python's HTTP server:
```bash
python -m http.server 8000
OR
py -m http.server 8000
# then open http://localhost:8000
```

## How to Use
- Click on the on-screen buttons to enter numbers and operators.
- Use your keyboard to type digits and operators. Supported keys:
  - `0-9` digits
  - `.` decimal point
  - `+`, `-`, `*`, `/` operators
  - `Enter` to evaluate
  - `Backspace` to remove the last digit
  - `Delete` to clear the entry (CE)
  - `Escape` to clear all (C)
- Use memory buttons for simple memory operations:
  - `MC` - Clear memory
  - `MR` - Recall memory to display
  - `M+` - Add current entry to memory
  - `M-` - Subtract current entry from memory
  - `MS` - Store current entry to memory
  - `M`  - Display memory value in entry

## Project Structure
- `index.html` — Main HTML file and app container
- `assets/styles.css` — Styles, themes, and responsive layout
- `assets/index.js` — Calculator logic, keyboard controls, canvas animation, and theme toggle
- `assets/library-3.otf` — Optional font file used for display

## Accessibility & Performance
- Dark/light themes are implemented using CSS variables for quick switching and performance-friendly transitions.
- Input fields are readable and buttons include focus styling for keyboard navigation.
- The starry background uses `requestAnimationFrame` and is low-overhead so it remains smooth on modern devices.

## Contributing
Contributions are welcome. Please open issues for suggestions or bug reports and submit pull requests for improvements.

## Roadmap
- Add calculation history with a persistent panel and clipboard copy
- Support parenthesis and order-of-operations for more advanced expressions
- Optional: Add scientific functions (sin/cos/tan, log, etc.) and more customizable themes

## Screenshots
![Calculator Screenshot](https://github.com/DantelCode/calculator/blob/main/screenshots/1.png)
