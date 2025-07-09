import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { deleteAllUsers, updateHighScore } from '../firebase/firebaseUtils';

export default function HelpScreen({ navigation }: any) {

    useEffect(() => {
        //  for (let i = 0; i < 20; i++) {
        //    updateHighScore(Math.round(100 * Math.random()));
        // }

        // deleteAllUsers();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hướng dẫn</Text>
            <Text style={styles.helpText}>
             {`Chọn ô màu khác biệt càng nhanh càng tốt để ghi điểm cao nhất.
              \nMỗi giây trôi qua, màu sẽ khác biệt rõ hơn nhưng điểm nhận được sẽ giảm dần!
              \n Hãy Login with Facebook thể có thể thấy tên và avatar của mình`}
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, marginBottom: 32, color: '#3b82f6', textAlign: 'center' },
    helpText: { fontSize: 16, color: '#444', marginBottom: 32, textAlign: 'center' },
    button: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, minWidth: 180 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});