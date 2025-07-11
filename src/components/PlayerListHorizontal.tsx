import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { MainColor } from '../utils';
import AvatarIcon from './AvatarIcon';

const Icon = FontAwesome6 as unknown as React.FC<any>;

interface Player {
  key: string;
  name: string;
  url?: string;
  highScore?: number;
}

interface Props {
  players: Player[];
  hostKey: string;
  showScore?: boolean;
}

const PlayerListHorizontal: React.FC<Props> = ({ players, hostKey, showScore = false }) => {
  // Chủ phòng đứng đầu
  const sortedPlayers = [
    ...players.filter((p) => p.key === hostKey),
    ...players.filter((p) => p.key !== hostKey),
  ];

  return (
    <FlatList
      data={sortedPlayers}
      keyExtractor={(item) => item.key}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listWrap}
      renderItem={({ item }) => {
        const isHost = item.key === hostKey;
        return (
          <View style={styles.playerItem}>
            <View style={styles.avatarWrap}>
              {item.url ? (
                <Image source={{ uri: item.url }} style={styles.avatarImg} />
              ) : (
                <AvatarIcon size={56}/>
              )}
            </View>
            {isHost && (
                <View style={styles.crownWrap}>
                  <Icon name="key" size={12} color="#FFD700" />
                </View>
              )}
            <Text style={styles.playerName} numberOfLines={1}>
              {item.name}
            </Text>
            {showScore && <Text style={styles.playerScore}>
              <Icon name="trophy" size={12} color={MainColor} /> {item.highScore ?? 0}
            </Text>}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  listWrap: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  playerItem: {
    width: 76,
    alignItems: 'center',
    marginRight: 10,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MainColor,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  crownWrap: {
    position: 'absolute',
    top: 0,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 1,
  },
  playerName: {
    marginTop: 3,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 72,
  },
  playerScore: {
    marginTop: 2,
    fontSize: 13,
    color: MainColor,
    fontWeight: 'bold',
    backgroundColor: '#e3eaf7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarDefault: {
    backgroundColor: '#e3eaf7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlayerListHorizontal;
