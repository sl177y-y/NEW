import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  List,
  Switch,
  Text,
  useTheme,
  Card
} from 'react-native-paper';
import { Settings as SettingsIcon, Key, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content 
          title="Settings" 
          titleStyle={styles.headerTitle}
        />
        <SettingsIcon size={24} color={theme.colors.primary} />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Configuration
            </Text>
            
            <List.Item
              title="API Configuration"
              description="Configure your Gemini API key"
              left={() => <Key size={20} color={theme.colors.onSurfaceVariant} />}
              onPress={() => {}}
            />
            
            <List.Item
              title="Enable Notifications"
              description="Get notified about new features"
              left={() => <Info size={20} color={theme.colors.onSurfaceVariant} />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              About
            </Text>
            <Text style={[styles.aboutText, { color: theme.colors.onSurfaceVariant }]}>
              AI Product Advisor uses Google's Gemini AI to provide intelligent product recommendations based on your natural language queries.
            </Text>
            <Text style={[styles.versionText, { color: theme.colors.onSurfaceVariant }]}>
              Version 1.0.0
            </Text>
          </Card.Content>
        </Card>
      </View>
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
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});