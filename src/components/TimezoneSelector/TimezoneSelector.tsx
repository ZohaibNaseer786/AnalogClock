import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Timezone } from '../../database/types';

interface TimezoneSelectorProps {
  timezones: Timezone[];
  selectedTimezone: Timezone;
  onTimezoneChange: (index: number) => void;
  loading?: boolean;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  timezones,
  selectedTimezone,
  onTimezoneChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Loading timezones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Timezone:</Text>
      <Picker
        mode="dropdown"
        selectedValue={selectedTimezone.zoneName}
        onValueChange={(_, index) => {
          onTimezoneChange(index);
        }}
        dropdownIconColor="black"
      >
        {timezones.map(tz => (
          <Picker.Item
            color="black"
            key={tz.zoneName}
            label={`${tz.countryName} (${tz.zoneName})`}
            value={tz.zoneName}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  pickerItem: {
    fontSize: 16,
    height: 44,
  },
});
