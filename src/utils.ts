import { CODE_LENGHT } from './constant';

// Tạo màu ngẫu nhiên với giới hạn độ sáng
export const getRandomBaseColor = (): { r: number; g: number; b: number } => {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return { r, g, b };
};

// Chuyển RGB sang HEX
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Sinh target color dựa trên độ chênh lệch
export const getTargetColor = (
  baseColor: { r: number; g: number; b: number },
  difference: number
): string => {
  const { r, g, b } = baseColor;
  return rgbToHex(
    Math.min(r + difference, 255),
    Math.min(g + difference, 255),
    Math.min(b + difference, 255)
  );
};

// Tính grid size theo level (mỗi 5 level tăng 1)
export const getGridSizeByLevel = (level: number, startSize = 5): number => {
  return startSize + Math.floor((level - 1) / 5);
};

// Random index target trong grid
export const getRandomTargetIndex = (gridSize: number): number => {
  return Math.floor(Math.random() * gridSize * gridSize);
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const getRandomString = () => {
  let result = '';
  let used = new Set();
  while (result.length < CODE_LENGHT) {
    const idx = Math.floor(Math.random() * chars.length);
    const char = chars[idx];
    if (!used.has(char)) {
      result += char;
      used.add(char);
    }
  }
  return result;
}

export const getDeviceId = (roomId: string): string => {
  if (__DEV__) {
    return `DEV_${roomId}`;
  }
  const DeviceInfo = require('react-native-device-info').default;
  return DeviceInfo.getUniqueIdSync();
}
