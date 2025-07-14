/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { createRoom, joinRoom } from './roomFunctions';
import { useNavigation } from '@react-navigation/native';
import { MainColor } from '../../utils';
import Header from '../../components/Header';
import LoadingFullScreen from '../../components/LoadingFullScreen';
import { useUserInfo } from '../../hooks/useUserInfo';

const JoinRoomScreen = () => {
    const navigation = useNavigation<any>();
    const [playerName, setPlayerName] = useState('');
    const [totalLevel, setTotalLevel] = useState(10); // Mặc định 10
    const [roundTime, setRoundTime] = useState(3); // Mặc định 3 giây
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const userInfo = useUserInfo();

    // Tạo phòng mới
    const handleCreateRoom = async () => {
        if (!playerName.trim()) {
            Alert.alert('Lỗi', 'Bạn cần nhập tên!');
            return;
        }
        if (isNaN(totalLevel) || totalLevel < 10 || totalLevel > 30) {
            Alert.alert('Lỗi', 'Tổng số màn chơi phải từ 10 đến 30!');
            return;
        }
        setLoading(true);
        try {
            const { roomCode, playerKey } = await createRoom(playerName.trim(), totalLevel, roundTime, userInfo?.url);
            navigation.replace('GameRoom', {
                roomCode,
                playerKey,
                playerName: playerName.trim(),
                isHost: true,
            });
        } catch (e) {
            Alert.alert('Lỗi', 'Không tạo được phòng');
        }
        setLoading(false);
    };

    // Vào phòng đã có
    const handleJoinRoom = async () => {
        if (!playerName.trim() || !roomCodeInput.trim()) {
            Alert.alert('Lỗi', 'Bạn cần nhập tên và mã phòng!');
            return;
        }
        setLoading(true);
        try {
            const playerKey = await joinRoom(roomCodeInput.trim().toUpperCase(), playerName.trim(), userInfo?.url);
            navigation.replace('GameRoom', {
                roomCode: roomCodeInput.trim().toUpperCase(),
                playerKey,
                playerName: playerName.trim(),
                isHost: false,
            });
        } catch (e) {
            Alert.alert('Lỗi', 'Không vào được phòng!');
        }
        setLoading(false);
    };

    return (
        <LoadingFullScreen isLoading={loading}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#e6ecf7' }}
                behavior={'padding'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.bg}>
                        <Header title="🎉 Solo với lũ bạn" navigation={navigation} />
                        <View style={styles.card}>
                            {/* Block 1: Tạo phòng mới */}
                            <View style={styles.blockSection}>
                                <Text style={styles.blockTitle}>Tạo phòng mới</Text>
                                <Text style={styles.helperText}>Một người tạo phòng thui nhé!</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập tên của bạn"
                                    value={playerName}
                                    onChangeText={setPlayerName}
                                    placeholderTextColor="#aaa"
                                />
                                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Tổng số màn chơi (10-30):</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="10-30"
                                    keyboardType="numeric"
                                    value={totalLevel.toString()}
                                    onChangeText={text => {
                                        const num = parseInt(text, 10);
                                        if (!isNaN(num) && num >= 10 && num <= 30) setTotalLevel(num);
                                        else setTotalLevel(10);
                                    }}
                                    maxLength={2}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Thời gian mỗi màn:</Text>
                                    <View style={{ flexDirection: 'row', marginLeft: 10}}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
                                            onPress={() => setRoundTime(3)}
                                        >
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10,
                                                borderWidth: 2, borderColor: MainColor,
                                                alignItems: 'center', justifyContent: 'center', marginRight: 6,
                                                backgroundColor: roundTime === 3 ? MainColor : 'transparent'
                                            }}>
                                                {roundTime === 3 && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} />}
                                            </View>
                                            <Text>3 giây</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => setRoundTime(5)}
                                        >
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10,
                                                borderWidth: 2, borderColor: MainColor,
                                                alignItems: 'center', justifyContent: 'center', marginRight: 6,
                                                backgroundColor: roundTime === 5 ? MainColor : 'transparent'
                                            }}>
                                                {roundTime === 5 && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} />}
                                            </View>
                                            <Text>5 giây</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: MainColor }]}
                                    onPress={handleCreateRoom}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Tạo phòng mới</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.dividerWrap}>
                                <View style={styles.divider} />
                                <Text style={styles.orText}>Hoặc</Text>
                                <View style={styles.divider} />
                            </View>
                            {/* Block 2: Vào phòng */}
                            <View style={styles.blockSection}>
                                <Text style={styles.blockTitle}>Vào phòng đã có</Text>
                                <Text style={styles.helperText}>Nhập mã phòng mà bạn bè đã tạo.</Text>
                                <TextInput
                                    style={styles.inputCode}
                                    placeholder="Nhập mã phòng"
                                    value={roomCodeInput}
                                    onChangeText={setRoomCodeInput}
                                    autoCapitalize="characters"
                                    maxLength={5}
                                    placeholderTextColor="#aaa"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập tên của bạn"
                                    value={playerName}
                                    onChangeText={setPlayerName}
                                    placeholderTextColor="#aaa"
                                />
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: MainColor }]}
                                    onPress={handleJoinRoom}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Vào phòng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LoadingFullScreen>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#e6ecf7',
        alignItems: 'center',
    },
    card: {
        marginTop: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        width: '92%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.13,
        shadowRadius: 16,
        elevation: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 18,
        color: MainColor,
        textAlign: 'center',
    },
    icon: {
        fontSize: 30,
    },
    input: {
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#b0c4de',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
        fontSize: 18,
        backgroundColor: '#f7faff',
        color: '#222',
    },
    button: {
        backgroundColor: MainColor,
        paddingVertical: 15,
        borderRadius: 50,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: MainColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 19,
        letterSpacing: 0.5,
    },
    orText: {
        fontSize: 17,
        marginVertical: 10,
        color: '#bbb',
        fontWeight: 'bold',
    },
    helperText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
        textAlign: 'center',
    },
    loadingWrap: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    inputCode: {
        borderWidth: 1.5,
        borderColor: '#1976D2',
        borderRadius: 10,
        marginBottom: 16,
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#fff',
        color: '#222',
        fontWeight: '600',
        letterSpacing: 4,
        shadowColor: '#1976D2',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    blockSection: {
        width: '100%',
        marginTop: 0,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 0,
        borderRadius: 10,
        backgroundColor: '#f7fafd',
        borderWidth: 1,
        borderColor: '#e3eaf7',
        shadowColor: '#1976D2',
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    blockTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: MainColor,
        marginBottom: 6,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    dividerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1.5,
        backgroundColor: '#e3eaf7',
        marginHorizontal: 8,
        borderRadius: 1,
    },
});

export default JoinRoomScreen;
