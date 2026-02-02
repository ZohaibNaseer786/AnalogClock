import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { convertLocalToZone } from '../../utils/clockUtils';
import { Timezone } from '../../database/types';

const { width } = Dimensions.get('window');
const CLOCK_SIZE = width * 0.9;
const CENTER = CLOCK_SIZE / 2;

interface AnalogClockProps {
  selectedTimezone: Timezone;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ selectedTimezone }) => {
  const [digitalClock, setDigitalClock] = useState('');
  const hourRotation = useSharedValue(0);
  const minuteRotation = useSharedValue(0);
  const secondRotation = useSharedValue(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const nowInZone = convertLocalToZone(now, {
        gmtOffset: selectedTimezone?.gmtOffset || 0,
      });
      const hours = nowInZone.getHours();
      const minutes = nowInZone.getMinutes();
      const seconds = nowInZone.getSeconds();

      const hoursString = (hours % 12 || 12).toString().padStart(2, '0');
      const minutesString = minutes.toString().padStart(2, '0');
      const secondsString = seconds.toString().padStart(2, '0');
      const ampm = hours < 12 ? 'AM' : 'PM';
      setDigitalClock(
        `${hoursString}:${minutesString}:${secondsString} ${ampm}`,
      );

      hourRotation.value = withTiming(hours * 30 + minutes * 0.5, {
        duration: 300,
      });
      minuteRotation.value = withTiming(minutes * 6 + seconds * 0.1, {
        duration: 300,
      });
      secondRotation.value = withTiming(seconds * 6, { duration: 300 });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [
    hourRotation,
    minuteRotation,
    secondRotation,
    selectedTimezone?.gmtOffset,
  ]);

  const useHandStyle = (
    rotation: any,
    width: any,
    height: any,
    color: string,
    zIndex = 1,
  ) => {
    return useAnimatedStyle(() => ({
      width,
      height,
      backgroundColor: color,
      position: 'absolute',
      top: CENTER - height / 2,
      left: CENTER - width / 2,
      borderRadius: width / 2,
      zIndex,
      transform: [
        { rotateZ: `${rotation.value}deg` },
        { translateY: -height / 2 },
      ],
    }));
  };

  const hourStyle = useHandStyle(hourRotation, 8, CENTER * 0.45, '#ffffffcc');
  const minuteStyle = useHandStyle(
    minuteRotation,
    5,
    CENTER * 0.7,
    '#ffffffcc',
  );
  const secondStyle = useHandStyle(secondRotation, 2, CENTER * 0.9, '#f87171');

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 * Math.PI) / 180;
      const outerR = CENTER - 5;
      const innerR = i % 5 === 0 ? outerR - 15 : outerR - 10;
      const x = CENTER + innerR * Math.sin(angle);
      const y = CENTER - innerR * Math.cos(angle);
      ticks.push(
        <View
          key={i}
          style={{
            position: 'absolute',
            width: i % 5 === 0 ? 3 : 1,
            height: i % 5 === 0 ? 12 : 6,
            backgroundColor: i % 5 === 0 ? '#94a3b8' : '#64748B',
            left: x,
            top: y,
            transform: [
              { translateX: i % 5 === 0 ? -1.5 : -0.5 },
              { translateY: -(i % 5 === 0 ? 12 : 6) / 2 },
              { rotate: `${i * 6}deg` },
            ],
          }}
        />,
      );
    }
    return ticks;
  };

  const renderNumber = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const r = CENTER - 30;
      const x = CENTER + r * Math.sin(angle);
      const y = CENTER - r * Math.cos(angle);
      numbers.push(
        <Text
          key={i}
          style={{
            position: 'absolute',
            left: x - 10,
            top: y - 11,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#e5e7eb',
          }}
        >
          {i}
        </Text>,
      );
    }
    return numbers;
  };

  return (
    <View style={styles.container}>
      <View style={styles.clockContainer}>
        <View style={styles.clock}>
          {renderTicks()}
          {renderNumber()}
          <Animated.View style={hourStyle} />
          <Animated.View style={minuteStyle} />
          <Animated.View style={secondStyle} />
          <View style={styles.centerDot} />
        </View>
      </View>
      <Text style={styles.digitalClock}>{digitalClock}</Text>
    </View>
  );
};

export default AnalogClock;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: CLOCK_SIZE + 20,
    width: CLOCK_SIZE + 20,
    borderRadius: (CLOCK_SIZE + 20) / 2,
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clock: {
    height: CLOCK_SIZE,
    width: CLOCK_SIZE,
    borderRadius: CLOCK_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f87171',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    position: 'absolute',
    left: CENTER - 8,
    top: CENTER - 8,
  },
  digitalClock: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: '600',
    textShadowColor: '#0ea5e9',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
    color: '#f8fafc',
  },
});
