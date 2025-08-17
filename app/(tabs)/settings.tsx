import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  List,
  Switch,
  Text,
  useTheme,
  Card,
  Modal,
  TextInput,
  Button
} from 'react-native-paper';
import { Settings as SettingsIcon, Key, Info } from 'lucide-react-native';
import { useApiKeyStore } from '../../src/state/apiKey';

export default function SettingsScreen() {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { apiKey, setApiKey } = useApiKeyStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const showModal = () => {
    setTempApiKey(apiKey);
    setModalVisible(true);
  };
  
  const hideModal = () => setModalVisible(false);

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    hideModal();
    Alert.alert("API Key Saved", "Your Gemini API key has been updated.");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content 
          title="Settings" 
          titleStyle={styles.headerTitle}
        />
        <SettingsIcon size={24} color={theme.colors.primary} />
      </Appbar.Header>

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Configuration
              </Text>
              
              <List.Item
                key="api-config"
                title="API Configuration"
                description="Configure your Gemini API key"
                left={() => <Key size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={showModal}
              />
              
              <List.Item
                key="notifications"
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

      <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Configure API Key</Text>
        <TextInput
          label="Gemini API Key"
          value={tempApiKey}
          onChangeText={setTempApiKey}
          style={styles.input}
          secureTextEntry
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <View style={styles.modalActions}>
          <Button onPress={hideModal} style={styles.button} textColor={theme.colors.onSurface}>Cancel</Button>
          <Button onPress={saveApiKey} mode="contained" style={styles.button}>Save</Button>
        </View>
      </Modal>
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
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 8,
  }
});