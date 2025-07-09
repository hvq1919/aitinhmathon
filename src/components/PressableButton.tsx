/* eslint-disable react/react-in-jsx-scope */
import { Pressable, Text, StyleSheet } from 'react-native';

export const PressableButton = ({ onPress, title, style }: any) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            style,
            pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
        ]}
    >
        <Text style={styles.text}>{title}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
