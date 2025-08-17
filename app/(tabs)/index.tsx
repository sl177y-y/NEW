import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { 
  SafeAreaView 
} from 'react-native-safe-area-context';
import {
  Appbar,
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  Card,
  Chip,
  useTheme,
  Snackbar
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import * as Speech from 'expo-speech';
import { Mic, MicOff, Sparkles } from 'lucide-react-native';
import { PRODUCT_CATALOG } from '@/src/catalog';
import ProductCard from '@/src/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  features: string[];
  imageUrl: string;
  description: string;
  brand: string;
  rating: number;
}

interface Recommendation extends Product {
  why: string;
}

const SAMPLE_QUERIES = [
  "I need a lightweight laptop for travel with good battery life",
  "Budget smartphone under $500 with great camera",
  "Noise-cancelling headphones for work from home",
  "Gaming laptop with RTX graphics under $2000",
  "Wireless earbuds for running and workouts"
];

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

export default function AdvisorScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const getRecommendations = async () => {
    if (!query.trim()) {
      setError('Please enter a product query');
      return;
    }

    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      setError('Please configure your Gemini API key');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const prompt = `
You are an expert product advisor. A user has asked: "${query}"

Here is our complete product catalog:
${JSON.stringify(PRODUCT_CATALOG, null, 2)}

Please analyze the user's query and recommend the top 3-5 most suitable products from this catalog. Consider:
- User's specific needs and preferences mentioned in the query
- Product features that match the requirements
- Price considerations if budget is mentioned
- Category relevance
- Brand reputation and ratings

For each recommendation, provide a clear explanation of why it matches the user's needs.

Respond with a JSON array in this EXACT format:
[
  {
    "id": "product_id",
    "name": "Product Name",
    "price": 999,
    "category": "Category",
    "features": ["feature1", "feature2"],
    "imageUrl": "image_url",
    "description": "description",
    "brand": "brand",
    "rating": 4.5,
    "why": "Detailed explanation of why this product matches the user's query, highlighting specific features and benefits that align with their needs."
  }
]

IMPORTANT: 
- Only recommend products that exist in the catalog
- Provide thoughtful, personalized explanations
- Consider the user's specific context and requirements
- If no perfect matches exist, recommend the closest alternatives
- Ensure the response is valid JSON only, no additional text
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const recommendedProducts = JSON.parse(jsonMatch[0]);
      setRecommendations(recommendedProducts);
      
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (Platform.OS === 'web') {
      setSnackbarVisible(true);
      return;
    }
    // Voice input would be implemented here for native platforms
    setIsListening(true);
    // Simulate voice input for demo
    setTimeout(() => {
      setIsListening(false);
      setQuery("I need a lightweight laptop for travel");
    }, 2000);
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const renderSampleQueries = () => (
    <View style={styles.sampleQueriesContainer}>
      <Text style={[styles.sampleQueriesTitle, { color: theme.colors.onSurfaceVariant }]}>
        Try these examples:
      </Text>
      <View style={styles.chipContainer}>
        {SAMPLE_QUERIES.map((sampleQuery, index) => (
          <Chip
            key={index}
            mode="outlined"
            onPress={() => handleSampleQuery(sampleQuery)}
            style={styles.chip}
          >
            {sampleQuery}
          </Chip>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content 
          title="AI Product Advisor" 
          titleStyle={styles.headerTitle}
        />
        <Sparkles size={24} color={theme.colors.primary} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={800} style={styles.inputSection}>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Describe what you're looking for and get personalized recommendations
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="What product are you looking for?"
              placeholder="e.g., I need a lightweight laptop for travel with good battery life"
              value={query}
              onChangeText={setQuery}
              multiline
              numberOfLines={3}
              style={styles.textInput}
              disabled={loading}
            />
            
            <Button
              mode="outlined"
              onPress={startVoiceInput}
              style={styles.voiceButton}
              disabled={loading}
              icon={() => isListening ? 
                <MicOff size={20} color={theme.colors.primary} /> : 
                <Mic size={20} color={theme.colors.primary} />
              }
            >
              {isListening ? 'Listening...' : 'Voice'}
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={getRecommendations}
            loading={loading}
            disabled={loading || !query.trim()}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Get AI Recommendations
          </Button>

          {error ? (
            <Animatable.View animation="shake">
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </Animatable.View>
          ) : null}
        </Animatable.View>

        {!loading && recommendations.length === 0 && !error && renderSampleQueries()}

        {loading && (
          <Animatable.View animation="fadeIn" style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
              Analyzing your request and finding the best matches...
            </Text>
          </Animatable.View>
        )}

        {recommendations.length > 0 && (
          <Animatable.View animation="fadeInUp" duration={600} delay={200}>
            <Text style={[styles.resultsTitle, { color: theme.colors.onSurface }]}>
              Recommended for you
            </Text>
            <FlatList
              data={recommendations}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Animatable.View 
                  animation="fadeInUp" 
                  duration={600} 
                  delay={100 * index}
                >
                  <ProductCard product={item} />
                </Animatable.View>
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </Animatable.View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Voice input is not available in web preview. Try in Expo Go app!
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  textInput: {
    flex: 1,
  },
  voiceButton: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  separator: {
    height: 16,
  },
  sampleQueriesContainer: {
    marginTop: 24,
  },
  sampleQueriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
});