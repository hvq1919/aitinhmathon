/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MainColor } from '../utils';

export const DotAnimation = ({
  message = 'Đang chờ người chơi khác',
}) => {
  const [dotIndex, setDotIndex] = useState(0);
  const dots = ['', '.', '..', '...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % dots.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={MainColor} />
      <Text style={styles.text}>
        {message}
        {dots[dotIndex]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 10,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
