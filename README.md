# Air Planner - Gesture-Controlled Calendar

A hands-free calendar application that lets you manage your schedule using **hand gestures** detected through your webcam. Built with a retro pixel art aesthetic.

## Features

- **Hand Gesture Control** - Navigate and interact with the calendar using webcam-based hand tracking
- **Voice Input** - Create events by speaking (Turkish speech recognition)
- **Google Calendar Sync** - Optionally connect and sync with your Google Calendar
- **Daily & Weekly Views** - Switch between views with a peace sign gesture
- **Pixel Art UI** - Retro 8-bit design with animated pixel characters

## Supported Gestures

| Gesture | Action |
|---------|--------|
| Open Palm | Move cursor |
| Fist | Select time slot / Save event |
| Swipe Left | Next day |
| Swipe Right | Previous day |
| Peace Sign | Toggle daily/weekly view |
| Thumbs Down | Delete event |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling with custom pixel art theme
- **MediaPipe Hands** - Real-time hand tracking & gesture recognition
- **Zustand** - State management
- **Google Calendar API** - Cloud calendar integration
- **Web Speech API** - Voice input

## Getting Started

### Prerequisites

- Node.js 18+
- A webcam (for gesture control)
- A modern browser (Chrome/Edge recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/tugcegun/Calendar-app.git
cd Calendar-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Google Calendar Setup (Optional)

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/      # React UI components
├── hooks/           # Custom React hooks
├── services/        # Business logic & API services
├── utils/           # Utility functions
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

## License

This project is open source and available under the [MIT License](LICENSE).
