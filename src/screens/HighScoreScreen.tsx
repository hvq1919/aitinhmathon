/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FacebookLogin from '../components/FacebookLogin';
const Icon = FontAwesome6 as unknown as React.FC<any>;
import { isEmpty } from 'lodash';
import AvatarIcon from '../components/AvatarIcon';
import { getDeviceId } from 'react-native-device-info';

interface User {
    id: string;
    fb_id: string;
    high_score: number;
    name: string;
    url: string;
}
const LIMIT = 200;
export default function HighScoreScreen({ navigation }: any) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [notInLimit, setNotInLimit] = useState(false);

    const deviceId = getDeviceId();
    useEffect(() => {
        const fetchHighScores = async () => {
            try {
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, orderBy('high_score', 'desc'), limit(LIMIT));
                const snapshot = await getDocs(q);

                const data: User[] = snapshot.docs.map(doc => ({
                    ...(doc.data() as User),
                }));

                const index = data.findIndex(user => user.id === deviceId);
                if (index === -1) {
                    setNotInLimit(true);
                }

                setUsers(data);
            } catch (e) {
                console.error('Error fetching users:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchHighScores();
    }, []);

    const renderItem = ({ item, index }: { item: User; index: number }) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;

        const bgColor = item.id === deviceId ? '#b2ebf2' : '#fff';
        return (
            <>
                <View style={[styles.item, { backgroundColor: bgColor }]}>
                    <Text style={styles.rank}>{medal}</Text>
                    {isEmpty(item.url) ? <AvatarIcon size={48} style={styles.avatar} /> :
                        <Image source={{ uri: item.url }} style={styles.avatar} />}
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.score}>🏆 {item.high_score}</Text>
                    </View>

                </View>
                {(index >= users.length - 1) && notInLimit && (
                    <View style={{marginBottom: 20, marginTop: 5, alignItems: 'center'}}>
                        <Text >{`Bạn xếp ngoài Top ${users.length}`}</Text>
                        <FacebookLogin/>
                    </View>

                )}
            </>
        );
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { marginBottom: 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={32} color="#3b82f6" />
                </TouchableOpacity>
                <Text style={styles.level}>Bảng Xếp Hạng</Text>
                <FacebookLogin />
            </View>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        paddingTop: StatusBar.currentHeight || 24,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    level: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#3b82f6',
        alignSelf: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 5,
        elevation: 1,
    },
    rank: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 30,
        color: '#3b82f6',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginHorizontal: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    score: {
        fontSize: 14,
        color: '#16a34a',
        marginTop: 4,
    },
});
