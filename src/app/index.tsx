import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// GEÇİCİ menü (B6'da asıl menüyle değişecek)
export default function Menu() {
  return (
    <View style={styles.container}>
      <Link href="/game?mode=capybara" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.label}>Kapibara</Text>
        </Pressable>
      </Link>
      <Link href="/game?mode=burak" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.label}>Burak Uçuyor</Text>
        </Pressable>
      </Link>
      <Link href="/sprites" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.label}>Görsel testi</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#BFE6F2',
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#3B2414',
  },
  label: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
});
