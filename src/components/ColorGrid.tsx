import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
    gridSize: number;
    baseColor: string;
    targetColor: string;
    targetIndex: number;
    onPress: (index: number) => void;
};

const GRID_MARGIN_HORIZONTAL = 8;
const GRID_PADDING = 8;

export const ColorGrid: React.FC<Props> = ({
    gridSize,
    baseColor,
    targetColor,
    targetIndex,
    onPress,
}) => {
    const cellPadding = 2;
    const totalPadding = cellPadding * (gridSize * 2);
    const cellSize = (SCREEN_WIDTH - totalPadding - 2 * GRID_MARGIN_HORIZONTAL - 2 * GRID_PADDING) / gridSize;
    const totalCells = gridSize * gridSize;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {Array.from({ length: totalCells }).map((_, index) => {
                    const color = index === targetIndex ? targetColor : baseColor;
                    return (
                        <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => onPress(index)}>
                            <View
                                style={[
                                    styles.cell,
                                    {
                                        width: cellSize,
                                        height: cellSize,
                                        margin: cellPadding,
                                        backgroundColor: color,
                                    },
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
            <Text style={styles.note}>
                {`Cứ mỗi giây thì màu khác biệt sẽ hiện rõ hơn.\nClick càng nhanh thì điểm càng cao.`}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
        borderRadius: 10,
        padding: GRID_PADDING,
        marginHorizontal: GRID_MARGIN_HORIZONTAL,
        elevation: 2,
    },
    cell: {
        borderRadius: 10,
        elevation: 4,
    },
    note: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        maxWidth: SCREEN_WIDTH,
    },
});