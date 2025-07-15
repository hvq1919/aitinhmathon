/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { MainColor } from '../utils';
const Icon = FontAwesome6 as unknown as React.FC<any>;

interface IProps {
  title: string;
  navigation: any;
  isOnline?: boolean;
}

export default function Header(props: IProps) {
  const { title, navigation, isOnline } = props;

  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerBox}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={MainColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        {/* Dùng View trống để cân bằng layout */}
        {/* Dấu hiệu online */}
        {isOnline ? <View style={{
          marginLeft: 8,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#eaffea',
          borderRadius: 8,
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#34c759',
            marginRight: 4,
          }} />
          <Text style={{ color: '#34c759', fontSize: 12, fontWeight: 'bold' }}>Online</Text>
        </View> : <View style={{ width: 40 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: StatusBar.currentHeight || 24,
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f6fa',
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: MainColor,
    letterSpacing: 0.2,
  },
});