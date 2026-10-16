import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PASSENGER_ABILITIES, PASSENGER_NAMES } from '@/art/passengers';
import { FriendPhoto, PHOTO_SIZE } from '@/components/FriendPhoto';
import { PASSENGER_KINDS, RARE_PASSENGERS } from '@/game/passengers';
import { useGameStore, type FriendEntry } from '@/store/useGameStore';
import { formatDate } from '@/utils/formatDate';

const DARK = '#3B2414';
// Arkadaş defteri: sırta binen her tür için bir anı fotoğrafı
export default function Album() {
  const insets = useSafeAreaInsets();
  const friends = useGameStore((state) => state.friends);
  const metCount = PASSENGER_KINDS.filter((kind) => friends[kind]).length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ Geri</Text>
        </Pressable>
        <Text style={styles.title}>Arkadaş Defteri</Text>
        <Text style={styles.subtitle}>
          {PASSENGER_KINDS.length} arkadaştan {metCount} tanesiyle tanıştın
        </Text>

        <View style={styles.grid}>
          {PASSENGER_KINDS.map((kind) => (
            <Polaroid key={kind} kind={kind} entry={friends[kind]} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Polaroid({ kind, entry }: { kind: (typeof PASSENGER_KINDS)[number]; entry?: FriendEntry }) {
  const met = entry !== undefined;
  return (
    <View style={styles.polaroid}>
      <View style={styles.tape} />
      <FriendPhoto kind={kind} met={met} />
      {RARE_PASSENGERS.includes(kind) && <Text style={styles.rare}>NADİR</Text>}
      <Text style={styles.name}>{met ? PASSENGER_NAMES[kind] : '???'}</Text>
      {met ? (
        <>
          <Text style={styles.ability}>{PASSENGER_ABILITIES[kind]}</Text>
          <Text style={styles.meta}>İlk tanışma: {formatDate(entry.firstMet)}</Text>
          <Text style={styles.meta}>{entry.rides} kez birlikte uçtunuz</Text>
        </>
      ) : (
        <Text style={styles.meta}>
          {RARE_PASSENGERS.includes(kind)
            ? 'Henüz tanışmadınız · sadece bazı günler çıkar'
            : 'Henüz tanışmadınız'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E6CF', // eski defter kâğıdı
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backText: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: DARK,
  },
  subtitle: {
    fontSize: 16,
    color: '#7A5A44',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  polaroid: {
    width: PHOTO_SIZE.width + 24,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0D2B8',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tape: {
    position: 'absolute',
    top: -8,
    width: 48,
    height: 16,
    backgroundColor: 'rgba(255, 210, 63, 0.6)', // fotoğrafı deftere tutturan bant
  },
  rare: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: 'white',
    backgroundColor: '#D9667A',
    overflow: 'hidden',
  },
  name: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
  },
  ability: {
    fontSize: 12,
    textAlign: 'center',
    color: '#7A5A44',
  },
  meta: {
    fontSize: 12,
    textAlign: 'center',
    color: '#9A8064',
  },
});
