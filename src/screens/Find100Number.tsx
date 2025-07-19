/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    PixelRatio,
    Platform,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated
} from 'react-native';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
const guidelineBaseWidth = 360; // Android phổ biến
function normalize(size: number) {
    if (Platform.OS !== 'android') return size; // chỉ scale trên Android
    const scale = DeviceWidth / guidelineBaseWidth;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
import Svg, { G, Path } from 'react-native-svg';
import { loadSounds, playCorrect, playWrong, releaseSounds } from '../soundManager';

type NumberItem = {
    value: number;
    x: number; // px (trong vùng giấy)
    y: number; // px
    color: string;
    rotation: number; // deg
};

const COLORS = [
    '#ef4444', // đỏ
    '#3b82f6', // xanh dương
    '#10b981', // xanh lá
    '#a21caf', // tím
    '#f59e42', // cam
    '#000',    // đen
    '#e11d48', // hồng đậm
    '#6366f1', // xanh tím
    '#f43f5e', // hồng
    '#22d3ee', // xanh cyan
];

const A4_WIDTH = DeviceWidth; // px (mobile), scale lại cho vừa màn hình
const A4_HEIGHT = DeviceHeight - (StatusBar.currentHeight || 24) - 48 - 48; // 48 : header, 48: Admob height
const NUMBER_SIZE = 32;

export default function Find100Number() {
    const [numbers, setNumbers] = useState<NumberItem[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [current, setCurrent] = useState(1);

    const lastSelected = selected[selected.length - 1];

    useEffect(() => {
        loadSounds();
        return () => {
            releaseSounds(); // cleanup
        };
    }, []);

    // Khởi tạo số random vị trí/màu/xoay
    useEffect(() => {
        // Random hoàn toàn vị trí x/y trên vùng A4, không chia lưới, không padding, chấp nhận chồng nhau nhẹ
        // Random vị trí số: giảm chồng lấn, tự nhiên hơn
        // Chia vùng A4 thành 10 hàng x 10 cột = 100 phần nhỏ, mỗi phần random 1 số
        const COLS = 8;
        const ROWS = Math.ceil(100 / COLS);
        const REGION_W = A4_WIDTH / COLS;
        const REGION_H = A4_HEIGHT / ROWS;
        const positions: { x: number, y: number }[] = [];
        for (let idx = 0; idx < 100; idx++) {
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;
            const regionX = col * REGION_W;
            const regionY = row * REGION_H;

            // Random 1 vị trí tuyệt đối trong phần này
            // x nằm trong khoảng [from, to] = [regionX - NUMBER_SIZE/4, regionX + REGION_W - NUMBER_SIZE*3/4]
            const x = (regionX - NUMBER_SIZE / 4) + Math.random() * (REGION_W - NUMBER_SIZE / 2);
            const y = (regionY - NUMBER_SIZE / 4) + Math.random() * (REGION_H - NUMBER_SIZE / 2);

            positions.push({ x, y });
        }
        // Bước 3: Gán cho số 1-100
        // Tạo mảng số từ 1 đến 100 và xáo trộn
        const values = Array.from({ length: 100 }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = values.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [values[i], values[j]] = [values[j], values[i]];
        }
        // Gán cho số 1-100 với vị trí ngẫu nhiên
        const arr: NumberItem[] = [];
        for (let i = 0; i < 100; i++) {
            arr.push({
                value: values[i], // dùng số đã xáo trộn
                x: positions[i].x,
                y: positions[i].y,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.floor(Math.random() * 360),
            });
        }
        setNumbers(arr);

        setSelected([]);
        setCurrent(1);
    }, []);

    const handleSelect = (num: number) => {
        if (num === current) {
            setSelected([...selected, num]);
            setCurrent(current + 1);
            playCorrect();
        } else {
            playWrong();
        }
    };

    // Render giấy ô ly vuông: các đường ngang, dọc xanh nhạt và một đường lề đỏ bên trái
    const renderGridPaper = () => {
        const cellSize = A4_WIDTH / 14; // px, ---> 14 ô
        const rows = Math.floor(A4_HEIGHT / cellSize);
        const cols = Math.floor(A4_WIDTH / cellSize);
        const lines = [];

        // Đường lề đỏ (dọc)
        // lines.push(
        //     <View
        //         key="red-margin"
        //         style={{
        //             position: 'absolute',
        //             left: cellSize * 2,
        //             top: 0,
        //             width: 2,
        //             height: A4_HEIGHT,
        //             backgroundColor: '#ff6b81',
        //             opacity: 0.7,
        //             zIndex: 1,
        //         }}
        //     />
        // );

        // Các đường kẻ ngang và nét đứt
        for (let i = 1; i <= rows; i++) {
            const y = i * cellSize;
            // Đường ngang liền
            lines.push(
                <View
                    key={`h-${i}`}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: y,
                        height: 1,
                        backgroundColor: '#b3e0fc',
                        opacity: 0.8,
                    }}
                />
            );
            // Đường ngang nét đứt thứ nhất (1/3 ô)
            lines.push(
                <View
                    key={`hdash1-${i}`}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: y - cellSize / 3,
                        height: 1,
                        borderStyle: 'dashed',
                        borderTopWidth: 0.7,
                        borderColor: '#b3e0fc',
                        opacity: 0.6,
                    }}
                />
            );
            // Đường ngang nét đứt thứ hai (2/3 ô)
            lines.push(
                <View
                    key={`hdash2-${i}`}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: y - (2 * cellSize) / 3,
                        height: 1,
                        borderStyle: 'dashed',
                        borderTopWidth: 0.7,
                        borderColor: '#b3e0fc',
                        opacity: 0.6,
                    }}
                />
            );
        }
        // Các đường kẻ dọc
        for (let j = 1; j <= cols; j++) {
            lines.push(
                <View
                    key={`v-${j}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: j * cellSize,
                        width: 1,
                        backgroundColor: '#b3e0fc',
                        opacity: 0.8,
                    }}
                />
            );
        }
        return lines;
    };

    {/* Vẽ 100 vùng màu nhạt để phân biệt */ }
    const render100Square = () => (
        [...Array(100)].map((_, idx) => {
            const COLS = 8;
            const ROWS = Math.ceil(100 / COLS);
            const REGION_W = A4_WIDTH / COLS;
            const REGION_H = A4_HEIGHT / ROWS;
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;
            // Dùng HSL để mỗi vùng 1 màu pastel khác nhau
            const hue = (idx * 37) % 360;
            const bgColor = `hsl(${hue}, 70%, 70%)`;
            return (
                <View
                    key={`region-bg-${idx}`}
                    style={{
                        position: 'absolute',
                        left: col * REGION_W,
                        top: row * REGION_H,
                        width: REGION_W,
                        height: REGION_H,
                        backgroundColor: bgColor,
                        opacity: 0.35,
                        zIndex: 0,
                    }}
                />
            );
        })
    );

    // Render số
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.icon}>←</Text>
                <Text style={styles.current}>{current <= 100 ? current : '✔️'}</Text>
                <Text style={styles.icon}>🔍</Text>
                <Text style={styles.icon}>⚙️</Text>
            </View>
            {/* Giấy kẻ ngang */}
            <View style={styles.a4sheet}>
                {renderGridPaper()}
                {/*render100Square()*/}
                {numbers.map(item => {
                    const isSelected = selected.includes(item.value);
                    return (
                        <TouchableOpacity
                            key={item.value}
                            style={[
                                styles.numberBox,
                                {
                                    paddingHorizontal: item.value < 10 ? 8 : 5,
                                    left: item.x,
                                    top: item.y,
                                    backgroundColor: 'transparent',
                                    transform: [{ rotate: `${item.rotation}deg` }],
                                },
                            ]}
                            onPress={() => handleSelect(item.value)}
                            disabled={isSelected || current > 100}
                            activeOpacity={0.7}
                        >
                            {/* Hiệu ứng động cho số vừa mới chọn đúng, số đã đúng thì giữ ellipse tĩnh */}
                            {isSelected && (
                                item.value === lastSelected ? (
                                    <CircleDrawAnimation size={NUMBER_SIZE - 8} />
                                ) : (
                                    <HandDrawnCircleStatic size={NUMBER_SIZE - 8} />
                                )
                            )}
                            <Text style={[styles.numberText, { color: item.color }]}>{item.value}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: '#f8fafc', paddingTop: 0 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: A4_WIDTH + 16,
        height: 48,
        paddingHorizontal: 8,
        backgroundColor: '#fdebd2',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginTop: StatusBar.currentHeight || 24,
    },
    icon: { fontSize: 22, color: '#222', width: 32, textAlign: 'center' },
    timer: { fontSize: 18, color: '#444', flex: 1, textAlign: 'center' },
    current: { fontSize: 24, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'center' },
    a4sheet: {
        width: A4_WIDTH,
        height: A4_HEIGHT,
        backgroundColor: '#fff',
        // borderRadius: 5,
        // borderWidth: 1,
        // borderColor: '#e5e7eb',
        marginVertical: 8,
        overflow: 'hidden',
    },
    numberBox: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberText: {
        fontSize: DeviceWidth / 20,
        textAlign: 'center',
        fontFamily: 'Caveat',
        fontWeight: '500',
    },
});

// Hiệu ứng khoanh tròn nét liền, vẽ tay tự nhiên
function CircleDrawAnimation({ size = 50, stroke = '#2563eb', strokeWidth = 3, duration = 300, style = {} }) {
    const rx = size / 2 + 6;
    const ry = size / 2 + 6;
    const cx = size / 2 + 9;
    const cy = size / 2 + 9;
    const rotate = (Math.random() - 0.5) * 10;
    const segments = 48;
    const noise = 4;

    // Tạo path ellipse méo tự nhiên
    const points = React.useMemo(
        () => getHandDrawnEllipsePoints(cx, cy, rx, ry, segments, noise),
        [cx, cy, rx, ry, segments, noise]
    );
    const path = React.useMemo(() => pointsToSvgPath(points), [points]);

    // Ước lượng chu vi path
    const perimeter = React.useMemo(() => {
        let len = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i][0] - points[i - 1][0];
            const dy = points[i][1] - points[i - 1][1];
            len += Math.sqrt(dx * dx + dy * dy);
        }
        return len;
    }, [points]);

    const animatedOffset = React.useRef(new Animated.Value(perimeter)).current;

    React.useEffect(() => {
        Animated.timing(animatedOffset, {
            toValue: 0,
            duration,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Svg
            width={size + 18}
            height={size + 18}
            style={[
                {
                    position: 'absolute',
                    left: -9,
                    top: -9,
                    zIndex: 2,
                    pointerEvents: 'none',
                },
                style,
            ]}
        >
            <G rotation={rotate} origin={`${(size + 18) / 2},${(size + 18) / 2}`}>
                <AnimatedPath
                    d={path}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={perimeter}
                    strokeDashoffset={animatedOffset}
                    opacity={0.93}
                />
            </G>
        </Svg>
    );
}
const AnimatedPath = Animated.createAnimatedComponent(Path);

function getHandDrawnEllipsePoints(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    segments: number = 120, // vừa phải để smoothing hiệu quả
    noise: number = 1.1
): [number, number][] {
    const points: [number, number][] = [];
    for (let i = 0; i < segments; i++) {
        const theta = (2 * Math.PI * i) / segments;
        const rrx = rx + (Math.random() - 0.5) * noise;
        const rry = ry + (Math.random() - 0.5) * noise;
        const x = cx + rrx * Math.cos(theta);
        const y = cy + rry * Math.sin(theta);
        points.push([x, y]);
    }
    points.push(points[0]);

    // Smoothing bằng moving average
    const smoothPoints: [number, number][] = [];
    const window = 7; // càng lớn càng mượt
    for (let i = 0; i < points.length; i++) {
        let sumX = 0, sumY = 0, count = 0;
        for (let j = -Math.floor(window / 2); j <= Math.floor(window / 2); j++) {
            const idx = (i + j + points.length) % points.length;
            sumX += points[idx][0];
            sumY += points[idx][1];
            count++;
        }
        smoothPoints.push([sumX / count, sumY / count]);
    }
    return smoothPoints;
}

function pointsToSvgPath(points: [number, number][]): string {
    return points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ') + ' Z';
}

function HandDrawnCircleStatic({
    size = 50,
    stroke = '#2563eb',
    strokeWidth = 2,
    customStyle = {},
}: {
    size?: number;
    stroke?: string;
    strokeWidth?: number;
    customStyle?: any;
}) {
    const rx = size / 2 + 6;
    const ry = size / 2 + 6;
    const cx = size / 2 + 9;
    const cy = size / 2 + 9;
    const segments = 48;
    const noise = 4;
    const points = React.useMemo(
        () => getHandDrawnEllipsePoints(cx, cy, rx, ry, segments, noise),
        [cx, cy, rx, ry, segments, noise]
    );
    const path = React.useMemo(() => pointsToSvgPath(points), [points]);
    return (
        <Svg
            width={size + 18}
            height={size + 18}
            style={[
                {
                    position: 'absolute',
                    left: -9,
                    top: -9,
                    zIndex: 2,
                    pointerEvents: 'none',
                },
                customStyle,
            ]}
        >
            <G origin={`${(size + 18) / 2},${(size + 18) / 2}`}>
                <Path
                    d={path}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="none"
                    opacity={0.9}
                />
            </G>
        </Svg>
    );
}