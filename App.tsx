import React, { useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase } from './src/database/database';
import AnalogClock from './src/components/AnalogClock/AnalogClock';
import { TimezoneSelector } from './src/components/TimezoneSelector/TimezoneSelector';
import { useTimezones } from './src/hooks/useTimezones';
import { useSelectedTimezone } from './src/hooks/useSelectedTimezone';

function App(): React.JSX.Element {
  const { timezones, loading: timezonesLoading, error } = useTimezones();
  const {
    selectedTimezone,
    setSelectedTimezone,
    loading: timezoneSelectionLoading,
  } = useSelectedTimezone();

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        console.log('App initialized successfully');
      } catch (err) {
        console.error('Error initializing app:', err);
      }
    };
    setup();
  }, []);

  // Debug logging
  useEffect(() => {
    // console.log('=== App State ===');
    // console.log('timezonesLoading:', timezonesLoading);
    // console.log('timezoneSelectionLoading:', timezoneSelectionLoading);
    // console.log('selectedTimezone:', selectedTimezone);
    // console.log('timezones count:', timezones.length);
    // console.log('error:', error);
    // console.log('================');
  }, [
    timezonesLoading,
    timezoneSelectionLoading,
    selectedTimezone,
    timezones,
    error,
  ]);

  const onTimezoneChangeHandler = (index: number) => {
    setSelectedTimezone(timezones[index]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>World Clock</Text>
            <Text style={styles.subtitle}>Analog Time Around the World</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
              <Text style={styles.errorHint}>
                Please check your connection and try again
              </Text>
            </View>
          )}

          <View style={styles.clockContainer}>
            <AnalogClock selectedTimezone={selectedTimezone} />
          </View>
          {selectedTimezone ? (
            <>
              {timezonesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#333" />
                  <Text style={styles.loadingText}>Loading timezones...</Text>
                </View>
              ) : timezones.length > 0 ? (
                <TimezoneSelector
                  timezones={timezones}
                  selectedTimezone={selectedTimezone}
                  onTimezoneChange={onTimezoneChangeHandler}
                />
              ) : null}

              <View style={styles.currentTimezoneContainer}>
                <Text style={styles.currentTimezoneLabel}>
                  Current Timezone:
                </Text>
                <Text style={styles.currentTimezoneValue}>
                  {selectedTimezone?.zoneName}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#333" />
              <Text style={styles.loadingText}>Initializing...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  clockContainer: {
    marginVertical: 20,
  },
  loadingContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  currentTimezoneContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  currentTimezoneLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentTimezoneValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default App;
