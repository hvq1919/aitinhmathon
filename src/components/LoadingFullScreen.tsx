/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface IProps {
  isLoading?: boolean;
  children: any;
}

export default function LoadingFullScreen(props: IProps) {
  const { children, isLoading = false } = props;

  return (
    <View style={{ flex: 1 }}>
      {children}
      {isLoading && <View style={{ 
        alignContent: 'center',
        justifyContent: 'center',
        position: 'absolute',
         top: 0, left: 0
         , right: 0, 
         bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <ActivityIndicator size="large" color={'#fff'} />
      </View>}
    </View>
  );
}