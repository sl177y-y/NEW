import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  Card,
  Text,
  Chip,
  useTheme,
  IconButton
} from 'react-native-paper';
import { Star, ExternalLink } from 'lucide-react-native';

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
  why?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i < fullStars ? '#FFD700' : theme.colors.outline}
          fill={i < fullStars ? '#FFD700' : 'transparent'}
        />
      );
    }
    
    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
          ({rating})
        </Text>
      </View>
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={styles.productInfo}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {product.name}
              </Text>
              <IconButton
                icon={() => <ExternalLink size={20} color={theme.colors.primary} />}
                size={20}
                onPress={() => {}}
              />
            </View>
            
            <View style={styles.brandRow}>
              <Chip mode="outlined" compact style={styles.brandChip}>
                {product.brand}
              </Chip>
              <Text style={[styles.category, { color: theme.colors.onSurfaceVariant }]}>
                {product.category}
              </Text>
            </View>
          </View>

          <View style={styles.priceRatingRow}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatPrice(product.price)}
            </Text>
            {renderStars(product.rating)}
          </View>

          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
            {product.description}
          </Text>

          <View style={styles.featuresContainer}>
            <Text style={[styles.featuresTitle, { color: theme.colors.onSurface }]}>
              Key Features:
            </Text>
            {product.features.slice(0, 3).map((feature, index) => (
              <Text key={index} style={[styles.feature, { color: theme.colors.onSurfaceVariant }]}>
                • {feature}
              </Text>
            ))}
            {product.features.length > 3 && (
              <Text style={[styles.moreFeatures, { color: theme.colors.primary }]}>
                +{product.features.length - 3} more features
              </Text>
            )}
          </View>

          {product.why && (
            <View style={[styles.whyContainer, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.whyTitle, { color: theme.colors.onPrimaryContainer }]}>
                Why it matches:
              </Text>
              <Text style={[styles.whyText, { color: theme.colors.onPrimaryContainer }]}>
                {product.why}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandChip: {
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  feature: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  moreFeatures: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  whyContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  whyText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});