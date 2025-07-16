import React from 'react';
import { View, Text } from 'react-native';
import roomSoloMessages from './roomSoloMessages';

interface Player {
    key: string;
    name: string;
    score?: number;
    url?: string;
}

interface PenaltyMessageViewProps {
    players: Player[];
}

const PenaltyMessageView: React.FC<PenaltyMessageViewProps> = ({ players }) => {
    if (!players || players.length < 2) return null;
    // Tìm điểm cao nhất và thấp nhất
    const scores = players.map(p => p.score ?? 0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    // Lọc danh sách người cao điểm nhất và thấp điểm nhất
    const winners = players.filter(p => (p.score ?? 0) === maxScore);
    const losers = players.filter(p => (p.score ?? 0) === minScore);
    // Random 1 hình phạt
    const message = roomSoloMessages[Math.floor(Math.random() * roomSoloMessages.length)];

    const winnerNames = winners.map(p => p.name).join(', ');
    const loserNames = losers.map(p => p.name).join(', ');

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, color: '#444', marginBottom: 2, textAlign: 'center' }}>
                🏆 Những người cao điểm nhất
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#388E3C', marginBottom: 2, textAlign: 'center' }}>
                {winnerNames}
            </Text>
            <Text style={{ fontSize: 14, color: '#444', marginBottom: 2, textAlign: 'center' }}>
                sẽ được thực hiện hình phạt:
            </Text>
            <View style={{
                backgroundColor: '#e0fbe7',
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginVertical: 8,
                borderColor: '#e89a23',
                borderWidth: 1,
                alignSelf: 'center',
                minWidth: 180,
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#e89a23',
                    textAlign: 'center',
                    textShadowColor: '#ffe9a3',
                    textShadowRadius: 6,
                }}>
                    ✨ {message}
                </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#444', marginBottom: 2, textAlign: 'center' }}>
                với những người thấp điểm nhất
            </Text>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#3a57e8', marginBottom: 2, textAlign: 'center' }}>
                {loserNames}
            </Text>
            <Text style={{ fontSize: 16, color: '#aaa', marginTop: 2, textAlign: 'center' }}>Chúc may mắn 🤪</Text>
        </View>
    );
};

export default PenaltyMessageView;
