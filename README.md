# Bhandarlok - Community Meals Sharing App

Bhandarlok is a React Native Expo app designed to connect people for sharing and exploring community meals (bhandaras) in Indian culture. The app features a premium design with Indian flag-inspired colors, smooth animations, and intuitive user experience.

## Features

- **Nearby Bhandaras**: Discover community meals near your location with location-based search.
- **Share Bhandaras**: Easily share details of your bhandara with images, timings, and descriptions.
- **Explore All**: Browse all available bhandaras with search and filter functionality.
- **User Authentication**: Secure login and registration system.
- **Profile Management**: View and manage your profile.
- **Settings**: Customize app preferences, including dark mode support.
- **Premium UI/UX**: Modern design with React Native Paper, animations, and responsive layouts.

## Tech Stack

- **Frontend**: React Native, Expo, Expo Router
- **UI Library**: React Native Paper
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Image Handling**: Cloudinary
- **Location Services**: Expo Location

## Design Highlights

- Indian flag color scheme (Saffron, Green, White)
- Smooth fade-in animations on all screens
- Skeleton loaders for better loading experience
- Pull-to-refresh functionality
- Date/time pickers for precise scheduling
- Card-based layouts with shadows and rounded corners
- Dark mode support (framework ready)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the backend server**

   Navigate to the `backend` directory and run:

   ```bash
   npm install
   npm start
   ```

3. **Start the Expo app**

   ```bash
   npx expo start
   ```

   Open the app in:
   - [Expo Go](https://expo.dev/go)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)

## Project Structure

- `app/`: Main application screens and components
  - `_layout.tsx`: Tab navigation and theme provider
  - `index.tsx`: Home screen with nearby bhandaras
  - `explore.tsx`: Explore all bhandaras with search
  - `share.tsx`: Share a new bhandara
  - `profile.tsx`: User profile screen
  - `settings.tsx`: App settings
  - `account.tsx`: Login/Register screen
  - `constants.ts`: App constants, colors, themes
- `backend/`: Node.js backend with Express and MongoDB
- `assets/`: Static assets like images and fonts

## Recent Updates

- Enhanced UI with React Native Paper components
- Added animations and transitions
- Implemented search and filter in Explore
- Added date/time pickers for bhandara scheduling
- Improved form validation and user feedback
- Added skeleton loaders and pull-to-refresh
- Prepared for dark mode implementation

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Powered by Ajay Digital Dreamworks
