import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_INFO_KEY } from '../constant';

type UserInfo = {
    name: string;
    url: string;
    fb_id: string;
};

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(USER_INFO_KEY)
            .then((val) => {
                if (val) {
                    setUserInfo(JSON.parse(val));
                }
            })
            .catch((err) => {
                console.error('Failed to load user info:', err);
            });
    }, []);

    return userInfo;
};
