import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import { USER_INFO_KEY } from '../constant';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { getDeviceId } from '../utils';
import { updateFacebookUser } from '../firebase/firebaseUtils';

interface IProps {
    highScore?: number;
}

const FacebookLogin = (props: IProps) => {
    const [userInfo, setUserInfo] = useState<null | { name: string; url: string; fb_id: string }>(null);

    useEffect(() => {
        AsyncStorage.getItem(USER_INFO_KEY).then(val => {
            if (val) {
                setUserInfo(JSON.parse(val));
            }
        });
    }, []);

    const handleFBLogin = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile']);
            if (result.isCancelled) return;

            const data = await AccessToken.getCurrentAccessToken();
            if (!data) return;

            const profile = await Profile.getCurrentProfile();
            if (profile) {
                const info = {
                    fb_id: profile.userID ?? getDeviceId(),
                    name: profile.name ?? '',
                    url: profile.imageURL ?? '',
                };
                setUserInfo(info);
                await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
                await updateFacebookUser(info);
            }
        } catch (e: any) {
            Alert.alert('Facebook Login failed', e?.message);
        }
    };

    const viewBxh = () => {
        return (
            <View >
                {userInfo ? (<View style={styles.profileBox}>
                    <Image
                        source={{ uri: userInfo.url }}
                        style={styles.avatar}
                    />
                </View>
                ) : (
                    <TouchableOpacity onPress={handleFBLogin} style={styles.loginBtn}>
                        <Image
                            style={styles.fbImage}
                            source={require('../assets/fb_login.png')}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return props.highScore ? (
        <View style={styles.container}>
            {userInfo ? (<View style={styles.profileBox}>
                <Image
                    source={{ uri: userInfo.url }}
                    style={styles.avatar}
                />
                <View style={{ marginLeft: 5, justifyContent: 'center' }}>
                    <Text style={styles.name}>{userInfo.name}</Text>
                    {props.highScore && <Text style={styles.score}>🏆 {props.highScore ?? 0}</Text>}
                </View>
            </View>
            ) : (
                <TouchableOpacity onPress={handleFBLogin} style={styles.loginBtn}>
                    <Image
                        style={styles.fbImage}
                        source={require('../assets/fb_login.png')}
                    />
                </TouchableOpacity>
            )}
        </View>
    ) : viewBxh();
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: 60,
    },
    profileBox: {
        flexDirection: 'row',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    score: {
        fontSize: 13,
        color: '#555',
    },
    loginBtn: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    fbImage: {
        width: 160,
        height: 40,
        resizeMode: 'contain',
    },
});

export default FacebookLogin;
