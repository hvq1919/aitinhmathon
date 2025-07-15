/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { deleteAllUsers, updateHighScore } from '../firebase/firebaseUtils';

export default function HelpScreen({ navigation }: any) {

    useEffect(() => {
        //  for (let i = 0; i < 20; i++) {
        //    updateHighScore(Math.round(100 * Math.random()));
        // }

        // deleteAllUsers();
    }, []);
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={[styles.title, { color: '#3a57e8', marginBottom: 18 }]}>📖 Hướng dẫn</Text>
                <View
                    style={{
                        backgroundColor: '#f0f4ff',
                        borderRadius: 14,
                        padding: 20,
                        marginBottom: 18,
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                    }}
                >
                    <Text style={[styles.helpText, { fontSize: 16, color: '#444', marginBottom: 10 }]}>🎯 <Text style={{ fontWeight: 'bold', color: '#3a57e8' }}>Chọn ô màu khác biệt</Text> càng nhanh càng tốt để ghi điểm cao nhất.</Text>
                    <Text style={[styles.helpText, { fontSize: 16, color: '#444', marginBottom: 10 }]}>⏳ Mỗi giây trôi qua, màu sẽ khác biệt rõ hơn nhưng <Text style={{ fontWeight: 'bold', color: '#e83a57' }}>điểm nhận được sẽ giảm dần!</Text></Text>
                    <Text style={[styles.helpText, { fontSize: 16, color: '#444' }]}>👤 <Text style={{ fontWeight: 'bold', color: '#2ecc40' }}>Login với Facebook</Text> để thấy tên và avatar của mình.</Text>
                </View>

                {/* Solo với lũ bạn instructions */}
                <View
                    style={{
                        backgroundColor: '#fff8e1',
                        borderRadius: 14,
                        padding: 18,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: '#ffe082',
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 1 },
                        elevation: 1,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ff9800', marginBottom: 8 }}>
                        👫 Solo với lũ bạn
                    </Text>
                    <Text style={[styles.helpText, { color: '#555', marginBottom: 6 }]}>• Một bạn tạo phòng, sau đó các bạn khác nhập mã phòng để vào phòng.</Text>
                    <Text style={[styles.helpText, { color: '#555', marginBottom: 6 }]}>• <Text style={{ fontWeight: 'bold', color: '#e83a57' }}>Người cao điểm nhất</Text> sẽ được làm gì đó với <Text style={{ fontWeight: 'bold', color: '#3a57e8' }}>người thấp điểm nhất</Text>.</Text>
                    <Text style={[styles.helpText, { color: '#3a57e8', fontWeight: 'bold' }]}>👉 Hãy click nhanh và đúng nhé!</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: '#3a57e8',
                            borderRadius: 10,
                            paddingVertical: 12,
                            paddingHorizontal: 32,
                            shadowColor: '#3a57e8',
                            shadowOpacity: 0.18,
                            shadowRadius: 6,
                            shadowOffset: { width: 0, height: 2 },
                            elevation: 2,
                        },
                    ]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.buttonText, { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 1 }]}>← Quay lại</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, marginBottom: 32, color: '#3b82f6', textAlign: 'center' },
    helpText: { fontSize: 16, color: '#444', marginBottom: 32, textAlign: 'center' },
    button: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, minWidth: 180 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});