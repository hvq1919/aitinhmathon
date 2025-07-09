/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';

/**
 * Use: <AvatarIcon size={72} />
 */


export default function AvatarIcon({ size = 64, color, style = {} }: { size?: number; color?: string; style?: any }) {
  const partColor = color || '#455A64';
  const headRadius = size * 0.22;
  const bodyWidth = size * 1;
  const bodyHeight = size * 1;
  return (
    <View
      style={[{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#cdcdcd',
        alignItems: 'center',
        overflow: 'hidden',
      }, style]}
    >
      {/* Head */}
      <View
        style={{
          width: headRadius * 2,
          height: headRadius * 2,
          borderRadius: headRadius,
          backgroundColor: partColor,
          marginBottom: 4,
          marginTop: 5,
        }}
      />
      {/* Body */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          backgroundColor: partColor,
        }}
      />
    </View>
  );
}