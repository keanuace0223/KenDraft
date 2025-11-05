# Mobile Legends: Bang Bang (MLBB) Esports Broadcasting Overlay System

A comprehensive real-time overlay system for Mobile Legends: Bang Bang esports broadcasts, featuring draft pick/ban displays, post-game statistics, scoreboards, and synchronized control panels. This system enables seamless management and broadcasting of professional MLBB matches with real-time synchronization across multiple displays.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Components Overview](#components-overview)
- [WebSocket Synchronization](#websocket-synchronization)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project provides a professional-grade broadcasting overlay system for Mobile Legends: Bang Bang esports tournaments. It consists of multiple synchronized display interfaces and control panels that work together to create a seamless broadcast experience. The system uses WebSocket technology for real-time synchronization between control panels and display screens.

### Key Capabilities

- **Real-time Draft Display**: Live pick/ban phase visualization with timer and phase indicators
- **Post-Game Statistics**: Comprehensive match statistics display
- **Scoreboard Management**: Real-time score tracking and team information
- **Multi-Client Synchronization**: WebSocket-based synchronization across multiple displays
- **Hero Management**: Complete hero database with images and voice lines
- **Custom Branding**: Team logos, nicknames, and custom styling

## ✨ Features

### Draft Pick/Ban System
- **18-Phase Draft Process**: Complete visualization of the MLBB draft phase
  - 5 ban phases per team (10 total bans)
  - 5 pick phases per team (10 total picks)
  - Adjustment phase for final modifications
- **Real-time Timer**: Countdown timer with visual progress bar
- **Phase Indicators**: Visual arrows and animations showing current phase
- **Hero Voice Lines**: Automatic playback of hero voice lines on selection
- **Animated Transitions**: Smooth hero image transitions and animations
- **Team Information**: Team names, logos, and player nicknames
- **Score Display**: Match score tracking

### Control Panel
- **Intuitive Interface**: User-friendly control panel for managing displays
- **Hero Selection**: Dropdown search functionality for hero picks/bans
- **Team Management**: Team names, logos, scores, and player nicknames
- **Swap Functionality**: Easy swapping of picks, bans, and player positions
- **Reset Options**: Quick reset for nicknames, logos, and other elements
- **Real-time Updates**: Instant synchronization with display screens

### Post-Game Display
- **Match Statistics**: Comprehensive post-game statistics
- **Player Performance**: Individual player statistics and performance metrics
- **Team Comparison**: Side-by-side team statistics
- **Build Information**: Item builds and spell selections
- **Game Number Tracking**: Multi-game series support

### Additional Features
- **Scoreboard Display**: Real-time scoreboard with team information
- **Notification System**: Custom notification displays
- **MVP Display**: Most Valuable Player recognition
- **Build Display**: Item and spell build visualization
- **Map Selection**: Map information display
- **Hub Interface**: Central navigation hub for all displays

## 📁 Project Structure

```
public/
├── Assets/                    # All media assets
│   ├── Font/                  # Custom fonts
│   ├── HeroPick/              # Hero portrait images
│   ├── Itemandspell/          # Item and spell icons
│   ├── map/                   # Map images
│   ├── notification/          # Notification videos
│   ├── Other/                 # UI elements and backgrounds
│   ├── player/                # Player placeholder images
│   ├── screenshots/           # Screenshot assets
│   └── VoiceLines/            # Hero voice line audio files
├── database/                  # JSON data files
│   ├── herolist.json          # Complete hero database
│   ├── items.json             # Item database
│   └── postgame.json          # Post-game data structure
├── External/                  # External configuration files
│   ├── ScoresightSetting.json
│   └── ScoresightSetting2.json
├── script/                    # JavaScript modules
│   ├── displayhero.js         # Hero display logic
│   ├── displaynicknamelogo.js # Team info display
│   ├── herodropdown.js        # Hero selection dropdown
│   ├── build.js               # Build display logic
│   ├── postgame.js            # Post-game display logic
│   └── ...
├── display2.html              # Main draft display (5 ban format)
├── display2.css               # Draft display styles
├── control.html               # Main control panel
├── control.css                # Control panel styles
├── postgame.html              # Post-game statistics display
├── scoreboard.html            # Scoreboard display
├── hub.html                   # Navigation hub
├── crossclient.js             # WebSocket client for displays
├── crosshost.js               # WebSocket host for control panels
└── serverip.txt               # WebSocket server IP configuration
```

## 🛠 Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Client-side logic and WebSocket communication
- **WebSocket**: Real-time bidirectional communication
- **LocalStorage API**: Client-side data persistence
- **Custom Fonts**: Renegade Pursuit, Big Noodle Titling
- **Audio API**: Hero voice line playback
- **Canvas/Image API**: Dynamic image rendering

## 📦 Prerequisites

- **Web Server**: Any HTTP server (Node.js, Apache, Nginx, Python, etc.)
- **WebSocket Server**: Node.js WebSocket server running on port 3000
- **Modern Web Browser**: Chrome, Firefox, Edge, or Safari (latest versions)
- **Network**: Local network or configured IP address for WebSocket connections

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
git clone <repository-url>
cd DRAFTING/public
```

### Step 2: Configure WebSocket Server IP

Edit `serverip.txt` and set your WebSocket server IP address:

```
192.168.50.132
```

Replace with your actual server IP address or use `localhost` for local development.

### Step 3: Start a Local Web Server

Choose one of the following methods:

**Option A: Python HTTP Server (Python 3)**
```bash
python -m http.server 8000
```

**Option B: Node.js HTTP Server**
```bash
npx http-server -p 8000
```

**Option C: PHP Built-in Server**
```bash
php -S localhost:8000
```

### Step 4: Start WebSocket Server

Ensure you have a WebSocket server running on port 3000. The system expects a WebSocket server that:
- Listens on port 3000
- Handles localStorage synchronization
- Broadcasts updates to all connected clients

Example WebSocket server setup (Node.js):
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  // Handle WebSocket connections
  // Sync localStorage updates
});
```

### Step 5: Access the Application

1. **Control Panel**: Open `http://localhost:8000/control.html` in your browser
2. **Display Screen**: Open `http://localhost:8000/display2.html` in another window/browser
3. **Hub**: Open `http://localhost:8000/hub.html` for navigation

## ⚙️ Configuration

### WebSocket Server Configuration

The system uses WebSocket for real-time synchronization. Configure the server IP in `serverip.txt`:

- **Local Development**: Use `localhost` or `127.0.0.1`
- **Network Deployment**: Use the local network IP address (e.g., `192.168.1.100`)
- **Remote Server**: Use the public IP or domain name

### Display Configuration

#### Display Resolution
- **Primary Resolution**: 1920x1080 (Full HD)
- **Display Size**: Optimized for 1920x367px draft display area

#### Custom Fonts
Fonts are located in `Assets/Font/`:
- `Renegade Pursuit.otf` - Main display font
- `big_noodle_titling.ttf` - Alternative font

### Hero Database

Hero data is stored in `database/herolist.json`. Each hero entry includes:
```json
{
  "name": "Hero Name",
  "img": "/Assets/HeroPick/hero_name.png",
  "voice": "/Assets/VoiceLines/hero_name.ogg"
}
```

## 📖 Usage Guide

### Control Panel Workflow

1. **Setup Teams**
   - Enter team names in the "BLUESIDE AND LOGO" and "REDSIDE AND LOGO" sections
   - Upload team logos using the file input fields
   - Set match scores

2. **Enter Player Nicknames**
   - Fill in player nicknames for both teams (5 players per team)
   - Use the "Swap" buttons to swap player positions within a team

3. **Manage Draft Phase**
   - **Ban Phase**: Select heroes to ban using the dropdowns in the "BANNING" section
   - **Pick Phase**: Select heroes to pick using the dropdowns in the "HEROPICK" section
   - Use the search functionality to quickly find heroes
   - Click "Swap" to swap picks/bans between slots

4. **Timer Control**
   - The timer automatically updates based on the current phase
   - Timer phases are managed through the WebSocket connection

5. **Reset Functions**
   - **Reset Nick**: Clears all player nicknames
   - **Reset Team Logo**: Clears uploaded team logos
   - **Switch Team Nickname**: Swaps team nicknames
   - **Switch Team Logo**: Swaps team logos

### Display Screen

The display screen (`display2.html`) automatically shows:
- **Upper Section**: Team names and ban slots (5 bans per team)
- **Lower Section**: Hero picks and player nicknames (5 picks per team)
- **Center Section**: Team logos, scores, timer, and phase indicator
- **Animations**: Smooth hero image transitions and phase indicators

### Draft Phase Flow

The system follows the standard MLBB draft format:

1. **Ban Phase 1** (Left → Right): 2 bans
2. **Ban Phase 2** (Right → Left): 2 bans
3. **Ban Phase 3** (Left → Right): 2 bans
4. **Ban Phase 4** (Right → Left): 2 bans
5. **Ban Phase 5** (Left → Right): 2 bans
6. **Pick Phase 1** (Right → Left): 1 pick per team
7. **Pick Phase 2** (Left → Right): 2 picks per team
8. **Pick Phase 3** (Right → Left): 1 pick per team
9. **Ban Phase 6** (Right → Left): 2 bans
10. **Ban Phase 7** (Left → Right): 2 bans
11. **Pick Phase 4** (Right → Left): 1 pick per team
12. **Pick Phase 5** (Left → Right): 2 picks per team
13. **Pick Phase 6** (Right → Left): 1 pick per team
14. **Adjustment Phase**: Final modifications

## 🔧 Components Overview

### Display Components

#### `display2.html`
Main draft pick/ban display screen featuring:
- 10 ban slots (5 per team)
- 10 pick slots (5 per team)
- Team information display
- Timer and countdown
- Phase indicators
- Hero voice line playback

#### `postgame.html`
Post-game statistics display showing:
- Match results
- Player statistics
- Item builds
- Spell selections
- Team comparisons

#### `scoreboard.html`
Real-time scoreboard with:
- Team logos
- Current scores
- Team names
- Map information

### Control Components

#### `control.html`
Main control panel with:
- Team management interface
- Hero selection dropdowns
- Player nickname inputs
- Logo upload functionality
- Timer controls
- Reset and swap functions

#### `hub.html`
Central navigation hub providing:
- Links to all display screens
- Links to all control panels
- Quick access to different views

### JavaScript Modules

#### `displayhero.js`
- Hero image display logic
- Voice line playback
- Animation handling
- Phase management

#### `displaynicknamelogo.js`
- Team name and logo display
- Player nickname management
- Score display
- Dynamic content updates

#### `herodropdown.js`
- Hero search and filtering
- Dropdown menu management
- Hero selection logic
- LocalStorage synchronization

#### `crossclient.js` / `crosshost.js`
- WebSocket client/host implementation
- Real-time synchronization
- LocalStorage mirroring
- Update broadcasting

## 🌐 WebSocket Synchronization

The system uses WebSocket for real-time synchronization between control panels and display screens.

### How It Works

1. **Control Panel (Host)**: Uses `crosshost.js`
   - Sends localStorage changes to WebSocket server
   - Broadcasts updates to all connected clients

2. **Display Screen (Client)**: Uses `crossclient.js`
   - Receives updates from WebSocket server
   - Updates localStorage and triggers UI updates
   - Listens for timer, hero, and image updates

### Synchronized Data

The following data is synchronized in real-time:
- Hero picks and bans (`selectedHero1-20`)
- Hero voice lines (`selectedVoice1-20`)
- Player nicknames (`name-box-1` through `name-box-14`)
- Team names and logos (`logo1`, `logo2`)
- Match scores
- Timer state (`timer`, `timerRunning`, `currentPhaseIndex`)
- Phase information

### WebSocket Messages

The system uses JSON messages with the following structure:
```javascript
{
  type: 'update' | 'clear' | 'fullSync',
  key: 'localStorage_key',
  value: 'localStorage_value',
  timestamp: Date.now()
}
```

## 📂 File Structure Details

### HTML Files

| File | Purpose |
|------|---------|
| `display2.html` | Main 5-ban draft display |
| `display2ban6.html` | 6-ban draft display variant |
| `control.html` | Main control panel |
| `controlban6.html` | Control panel for 6-ban format |
| `postgame.html` | Post-game statistics display |
| `postgamecontrol.html` | Post-game control panel |
| `scoreboard.html` | Scoreboard display |
| `scoreboardocr.html` | OCR-based scoreboard |
| `hub.html` | Navigation hub |
| `mvpdisplay.html` | MVP display screen |
| `notifdisplay.html` | Notification display |
| `notifcontrol.html` | Notification control |

### CSS Files

| File | Purpose |
|------|---------|
| `display2.css` | Main draft display styles |
| `control.css` | Control panel styles |
| `postgame.css` | Post-game display styles |
| `postdraft.css` / `postdraft2.css` | Post-draft styles |
| `scoreboard.css` | Scoreboard styles |
| `acdisplay.css` | Additional display styles |

### JavaScript Files

| File | Purpose |
|------|---------|
| `displayhero.js` | Hero display and animation logic |
| `displayheroban6.js` | 6-ban hero display variant |
| `displaynicknamelogo.js` | Team info and nickname display |
| `herodropdown.js` | Hero selection dropdown |
| `herodropdownban6.js` | 6-ban dropdown variant |
| `crossclient.js` | WebSocket client for displays |
| `crosshost.js` | WebSocket host for control panels |
| `build.js` | Build display logic |
| `postgame.js` | Post-game statistics logic |
| `controlnicknamelogo.js` | Control panel team management |

### Asset Directories

- **HeroPick/**: 130+ hero portrait images
- **VoiceLines/**: 130+ hero voice line audio files (.ogg format)
- **Itemandspell/**: 117 item and spell icons
- **Other/**: UI elements, backgrounds, animations
- **Font/**: Custom fonts for the overlay

## 🔍 Troubleshooting

### WebSocket Connection Issues

**Problem**: Display screens not updating in real-time

**Solutions**:
1. Verify WebSocket server is running on port 3000
2. Check `serverip.txt` contains correct IP address
3. Ensure firewall allows WebSocket connections
4. Check browser console for WebSocket errors
5. Verify network connectivity between control and display machines

### Audio Not Playing

**Problem**: Hero voice lines not playing

**Solutions**:
1. Click "Enable Audio" button (required for autoplay)
2. Check browser autoplay policies
3. Verify audio files exist in `Assets/VoiceLines/`
4. Check browser console for audio errors

### Images Not Loading

**Problem**: Hero images or logos not displaying

**Solutions**:
1. Verify file paths in `database/herolist.json`
2. Check that image files exist in `Assets/HeroPick/`
3. Ensure web server has proper file permissions
4. Check browser console for 404 errors
5. Verify image file names match exactly (case-sensitive)

### Timer Not Working

**Problem**: Timer not updating or showing incorrect values

**Solutions**:
1. Check WebSocket connection status
2. Verify `currentPhaseIndex` in localStorage
3. Check timer-related JavaScript functions
4. Ensure phase array is properly configured

### Display Not Synchronizing

**Problem**: Changes in control panel not appearing on display

**Solutions**:
1. Verify both pages are connected to WebSocket server
2. Check browser console for synchronization errors
3. Refresh display page
4. Check localStorage in browser DevTools
5. Verify `crossclient.js` and `crosshost.js` are loaded

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and structure
- Test WebSocket synchronization thoroughly
- Ensure compatibility across major browsers
- Update documentation for new features
- Test with multiple simultaneous connections

## 📝 Notes

### Browser Compatibility

- **Chrome/Edge**: Fully supported
- **Firefox**: Fully supported
- **Safari**: Fully supported (may require audio user interaction)
- **Opera**: Fully supported

### Performance Considerations

- Hero images are optimized for web display
- Audio files use OGG format for better compression
- WebSocket connections are lightweight and efficient
- LocalStorage is used for client-side caching

### Broadcast Setup Recommendations

1. **Control Panel**: Use on a separate monitor or device
2. **Display Screen**: Use OBS Browser Source or similar
3. **Resolution**: Set to 1920x1080 for best quality
4. **Network**: Use wired connection for WebSocket stability
5. **Backup**: Keep backup of hero database and assets

## 📄 License

This project is provided as-is for esports broadcasting purposes. Please ensure you have proper licensing for any game assets, fonts, or audio files used.

## 🙏 Acknowledgments

- Mobile Legends: Bang Bang game assets
- Community contributors
- Esports broadcasting teams using this system

---

**For support or questions**, please refer to the project documentation or open an issue in the repository.

**Version**: 2.0 (5-Ban Draft Format)

**Last Updated**: 2024

