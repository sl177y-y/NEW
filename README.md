# AI Product Advisor

A React Native application built with Expo that provides intelligent product recommendations using Google's Gemini AI. Users can input natural language queries and receive personalized product suggestions from a curated catalog.

## Features

- **Natural Language Queries**: Input product requirements in plain English
- **AI-Powered Recommendations**: Leverages Google's Gemini API for intelligent matching
- **Voice Input Support**: Voice-to-text functionality (on native platforms)
- **Interactive Product Cards**: Detailed product information with visual appeal
- **Sample Query Suggestions**: Pre-built examples to help users get started
- **Responsive Design**: Optimized for both iOS and Android
- **Light/Dark Theme Support**: Automatic theme switching based on system preferences
- **Modern Material Design**: Built with React Native Paper components

## Architecture

### File Structure

```
/
├── app/
│   ├── _layout.tsx          # Root layout with theming
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation setup
│   │   ├── index.tsx        # Main AI advisor screen
│   │   └── settings.tsx     # Settings and configuration
│   └── +not-found.tsx       # 404 error screen
├── src/
│   ├── catalog.js           # Product catalog data
│   └── components/
│       └── ProductCard.tsx  # Reusable product card component
├── hooks/
│   └── useFrameworkReady.ts # Framework initialization hook
└── README.md
```

### Key Components

1. **AdvisorScreen** (`app/(tabs)/index.tsx`): Main interface with query input, AI processing, and results display
2. **ProductCard** (`src/components/ProductCard.tsx`): Reusable component for displaying product recommendations
3. **Product Catalog** (`src/catalog.js`): Static data source with 12 diverse products across categories
4. **Settings Screen** (`app/(tabs)/settings.tsx`): Configuration and app information

## Setup Instructions

### Prerequisites

1. Install Expo CLI: `npm install -g @expo/cli`
2. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone or download the project
2. Install dependencies: `npm install`
3. Replace `YOUR_GEMINI_API_KEY` in `app/(tabs)/index.tsx` with your actual Gemini API key
4. Start the development server: `npm run dev`

### Running the App

- **Expo Go**: Scan the QR code with Expo Go app
- **Web**: Opens automatically in your browser
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal

## Usage

1. **Enter a Query**: Type or speak what product you're looking for
   - Example: "I need a lightweight laptop for travel with good battery life"
   
2. **Get Recommendations**: The AI analyzes your request against the product catalog

3. **Review Results**: Browse personalized recommendations with explanations

### Sample Queries

- "Budget smartphone under $500 with great camera"
- "Noise-cancelling headphones for work from home" 
- "Gaming laptop with RTX graphics under $2000"
- "Wireless earbuds for running and workouts"

## Customization

### Adding Products

Edit `src/catalog.js` to add new products:

```javascript
{
  id: "unique-id",
  name: "Product Name",
  price: 999,
  category: "Category",
  brand: "Brand",
  rating: 4.5,
  description: "Product description",
  features: ["Feature 1", "Feature 2"],
  imageUrl: "https://example.com/image.jpg"
}
```

### Modifying AI Behavior

Update the prompt in the `getRecommendations` function to change how the AI analyzes queries and selects products.

### Theming

Customize colors in `app/_layout.tsx`:

```javascript
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',      // Primary brand color
    secondary: '#009688',    // Secondary accent
    tertiary: '#FF9800',     // Tertiary accent
  },
};
```

## API Integration

The app uses Google's Gemini API for generating recommendations. The AI receives:

- User's natural language query
- Complete product catalog
- Structured prompt for consistent JSON responses

Response format from Gemini:
```json
[
  {
    "id": "product_id",
    "name": "Product Name",
    "price": 999,
    "features": ["feature1", "feature2"],
    "why": "Explanation of why this matches the user's needs"
  }
]
```

## Dependencies

- **expo**: Framework for React Native development
- **react-native-paper**: Material Design 3 components
- **react-native-animatable**: Smooth animations and transitions
- **expo-speech**: Voice input capabilities (native platforms)
- **lucide-react-native**: Modern icon library
- **expo-router**: File-based navigation system

## Deployment

This app can be deployed using:

- **Expo Application Services (EAS)**: For app store distribution
- **Expo Go**: For development and testing
- **Web**: Static hosting for web version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test on multiple platforms
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own AI-powered applications.