# Proximity-Based Adaptive Search Interface

An interactive search interface that adapts to user distance using laptop camera and face detection. When users lean forward, the interface shows detailed search results with full descriptions. When they sit back, it displays a brief overview with key information.

## Project Overview

This project demonstrates **proximity-based human-computer interaction** for search interfaces. Using MediaPipe Face Detection and webcam access, the system:

- 📹 **Tracks user distance** in real-time using face detection
- 🔍 **Adapts search result detail** based on proximity:
  - **Close** (< 50cm): Full results with detailed descriptions
  - **Medium** (50-80cm): Moderate detail with snippets
  - **Far** (> 80cm): Overview with top results only
- 🎯 **Respects privacy** - all processing happens locally in the browser

Perfect for demonstrating to Professor Hoeber how sensor-based interactions can enhance information retrieval interfaces.

## Repository Structure

```
hoeber-3d-searchscape/
├── backend/                # FastAPI backend (optional, for future extensions)
├── frontend/               # React + MediaPipe camera tracking app
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraTracker.tsx      # Face detection & distance tracking
│   │   │   └── AdaptiveSearchResults.tsx  # Distance-responsive UI
│   │   └── App.tsx                    # Main application
└── docs/
    └── hoeber-brief.md     # Research pitch for Dr. Hoeber
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser with camera access (Chrome, Edge, Firefox)
- Webcam or laptop camera

### Frontend Setup

```bash
cd hoeber-3d-searchscape/frontend
npm install
npm run dev
```

Then open the provided URL (usually `http://localhost:5173`) in your browser.

### Using the Application

1. **Grant camera permission** when prompted
2. **Position yourself** at a comfortable distance from the camera
3. **Observe the interface** adapting as you:
   - **Lean forward** → See detailed search results with full descriptions
   - **Sit back** → See brief overview with top results
4. **Enter a search query** to see adaptive results

## Technology Stack

- **React 19** + **TypeScript** - Modern frontend framework
- **MediaPipe Face Mesh** - Real-time face detection and tracking
- **getUserMedia API** - Camera access
- **Canvas API** - Visualization of face tracking

## How It Works

1. **Camera Access**: Requests user permission for camera access
2. **Face Detection**: Uses MediaPipe Face Mesh to detect facial landmarks
3. **Distance Estimation**: Calculates distance based on face bounding box size using similar triangles
4. **State Classification**: Categorizes distance into close/medium/far states
5. **UI Adaptation**: Dynamically adjusts search result presentation based on distance state

## Features

✅ **Privacy-First**: All processing happens locally - no data leaves your device  
✅ **Real-Time**: Instant response to distance changes  
✅ **Adaptive UI**: Smooth transitions between detail levels  
✅ **Responsive Design**: Works on various screen sizes  
✅ **Accessible**: Clear visual feedback and instructions  

## Future Enhancements (For Professor Hoeber)

- **Gesture Recognition**: Hand tracking for additional interaction modes
- **Eye Tracking**: Gaze-based interaction for result selection
- **Multi-User Support**: Collaborative search sessions
- **Backend Integration**: Real search API integration with adaptive ranking
- **VR/AR Support**: Extend to immersive environments
- **Calibration Mode**: Personal distance calibration for accuracy

## Research Context

This project bridges **information retrieval** and **human-computer interaction**:

- **IR Perspective**: Adaptive result presentation based on user context (proximity)
- **HCI Perspective**: Natural, embodied interaction without touch/click
- **Sensor Integration**: Demonstrates practical use of computer vision for interface control

## Browser Compatibility

- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support
- ✅ Safari - May have limitations with MediaPipe models

## Troubleshooting

**Camera not working?**
- Ensure you've granted camera permissions
- Check that no other application is using the camera
- Try refreshing the page

**Distance detection inaccurate?**
- Ensure good lighting
- Face the camera directly
- Maintain 30-150cm distance from camera

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT License - Feel free to use this for research and educational purposes.

---

Built for demonstrating proximity-based interaction to Professor Orland Hoeber at University of Regina.
