import React, { useState, useEffect } from 'react';
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
  Snackbar,
  IconButton
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Wand2, Sparkles, Search } from 'lucide-react-native';
import { useApiKeyStore } from '../../src/state/apiKey';
import ProductCard from '../../src/components/ProductCard';
import { PRODUCT_CATALOG } from '../../src/catalog';

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
  productUrl: string;
}

interface Recommendation extends Product {
  why: string;
  productUrl: string;
}

const SAMPLE_QUERIES = [
  "I'm looking for a way to relieve neck pain",
  "I want a device to help with hair growth",
  "I need a way to monitor my heart health at home",
  "I'm looking for a smart robot for my kids",
  "I want a good pair of headphones for listening to music"
];

const wittyLoadingMessages = [
  "Consulting the digital oracle...",
  "Warming up the AI brain cells...",
  "Searching the product cosmos...",
  "Crafting recommendations just for you...",
  "Asking the silicon sages for advice...",
];

export default function AdvisorScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { apiKey } = useApiKeyStore();

  const improvePrompt = async () => {
    if (!query.trim()) {
      Alert.alert('No Query', 'Please enter a query first to improve it.');
      return;
    }

    if (!apiKey) {
      Alert.alert('API Key Required', 'Please configure your Gemini API key in Settings first.');
      return;
    }

    try {
      const improvePromptText = `
You are a product search expert. Transform the user's basic query into a comprehensive 2-3 line search request that will help AI find the best products.

Available Product Categories:
- Healthtech and Wellness (pain relief devices, massagers, health monitors, wellness gadgets)
- Personal Care (hair dryers, styling tools, grooming devices)
- Entertainment (headphones, speakers, projectors, gaming accessories, toys, robots)
- Kitchen Appliances (cooking robots, coffee machines, smart kitchen devices)
- Home Improvement (vacuum cleaners, air purifiers, smart home devices, cleaning tools)
- Travel & Lifestyle (smart luggage, backpacks, travel accessories)
- Smart Mobility (wheelchairs, scooters, hoverboards, electric vehicles)
- Security & Surveillance (smart locks, cameras, doorbells, dash cams)

Original Query: "${query}"

Transform this into a detailed 2-3 line query that includes:
1. Specific use case or problem to solve
2. Key features or requirements the user might need
3. Context about when/how they'll use it

Example transformations:
"headphones" → "I need high-quality headphones for daily music listening and gaming sessions. Looking for comfortable over-ear design with good bass response. Will be used for long periods at home and during commutes."

"vacuum cleaner" → "I want a smart robot vacuum for automated home cleaning that can handle pet hair and dust. Need advanced navigation to clean efficiently without getting stuck. Looking for scheduling features and powerful suction for deep carpet cleaning."

Improved Query (2-3 lines):
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: improvePromptText
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to improve prompt');
      }

      const data = await response.json();
      const improvedQuery = data.candidates[0].content.parts[0].text.trim();
      
      setQuery(improvedQuery);
      setSnackbarVisible(true);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to improve prompt. Please try again.');
    }
  };

  const getRecommendations = async () => {
    if (!query.trim()) {
      setError('Please enter a product query');
      return;
    }

    if (!apiKey) {
      setError('Please configure your Gemini API key in Settings');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);
    setLoadingMessage(wittyLoadingMessages[Math.floor(Math.random() * wittyLoadingMessages.length)]);

    try {
      const enhancedPrompt = `
You are an expert AI Product Advisor with deep knowledge of consumer electronics, health tech, and smart devices. 

USER QUERY: "${query}"

PRODUCT CATALOG:
${JSON.stringify(PRODUCT_CATALOG, null, 2)}

INSTRUCTIONS:
1. Analyze the user's query to understand their:
   - Primary needs and pain points
   - Budget considerations (if mentioned)
   - Use case scenarios
   - Preferences (brand, features, etc.)

2. From the provided catalog, select the TOP 3-5 most relevant products that:
   - Directly address the user's stated needs
   - Offer the best value proposition
   - Have complementary features that enhance the solution
   - Consider alternative approaches to their problem

3. For each recommendation, provide:
   - A personalized explanation of WHY this product matches their needs
   - How it solves their specific problem
   - Key features that matter most for their use case
   - Any potential limitations or considerations

4. Rank recommendations by relevance and value to the user.

RESPONSE FORMAT (JSON only, no additional text):
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
    "productUrl": "product_url",
    "why": "Comprehensive explanation tailored to the user's specific needs, highlighting how this product uniquely addresses their requirements and the benefits they'll experience."
  }
]

IMPORTANT: 
- Only recommend products that exist in the catalog
- Provide thoughtful, personalized explanations
- Consider the user's specific context and requirements
- If no perfect matches exist, recommend the closest alternatives with honest limitations
- Ensure the response is valid JSON only
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: enhancedPrompt
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content 
          title="AI Product Advisor" 
          titleStyle={styles.headerTitle}
        />
        <Sparkles size={24} color={theme.colors.primary} />
      </Appbar.Header>

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
        <ScrollView 
          style={[styles.content, { backgroundColor: theme.colors.background }]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: theme.colors.background }}
        >
          <Animatable.View animation="fadeInUp" duration={800} style={styles.inputSection}>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Describe what you're looking for and get personalized recommendations
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="What product are you looking for?"
                placeholder="e.g., I need a lightweight laptop for travel"
                value={query}
                onChangeText={setQuery}
                multiline
                numberOfLines={3}
                style={styles.textInput}
                disabled={loading}
                left={<TextInput.Icon icon={() => <Search size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
              
              <IconButton
                mode="outlined"
                onPress={improvePrompt}
                style={styles.improveButton}
                disabled={loading}
                icon={() => <Wand2 size={20} color={theme.colors.primary} />}
              />
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
                {loadingMessage}
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
      </SafeAreaView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Query improved! The enhanced version should give better results.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 0, // Remove bottom padding to eliminate gap above tab bar
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
  improveButton: {
    marginBottom: 8,
    minWidth: 56,
    justifyContent: 'center',
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