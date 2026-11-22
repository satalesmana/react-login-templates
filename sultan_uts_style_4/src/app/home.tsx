import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Whisper = {
  id: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
};

const INITIAL_WHISPERS: Whisper[] = [
  {
    id: "1",
    text: "Kadang diam itu lebih berisik daripada teriak.",
    likes: 12,
    liked: false,
    time: "2m ago",
  },
  {
    id: "2",
    text: "Aku pura-pura baik-baik aja hari ini, dan nggak ada yang sadar.",
    likes: 31,
    liked: false,
    time: "15m ago",
  },
  {
    id: "3",
    text: "Terima kasih buat siapa pun yang ninggalin catatan semangat di meja perpustakaan.",
    likes: 48,
    liked: false,
    time: "1h ago",
  },
];

const MAX_LENGTH = 200;

export default function Home() {
  const [whispers, setWhispers] = useState<Whisper[]>(INITIAL_WHISPERS);
  const [text, setText] = useState("");

  const handlePost = () => {
    const clean = text.trim();
    if (!clean) return;

    const newWhisper: Whisper = {
      id: Date.now().toString(),
      text: clean,
      likes: 0,
      liked: false,
      time: "Just now",
    };
    setWhispers([newWhisper, ...whispers]);
    setText("");
  };

  const toggleLike = (id: string) => {
    setWhispers(
      whispers.map((w) =>
        w.id === id
          ? {
              ...w,
              liked: !w.liked,
              likes: w.liked ? w.likes - 1 : w.likes + 1,
            }
          : w,
      ),
    );
  };

  const renderItem = ({ item }: { item: Whisper }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={16} color="#fff" />
        </View>
        <Text style={styles.anon}>Anonymous</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <Text style={styles.whisperText}>{item.text}</Text>

      <Pressable style={styles.likeRow} onPress={() => toggleLike(item.id)}>
        <Ionicons
          name={item.liked ? "heart" : "heart-outline"}
          size={22}
          color={item.liked ? "#E0245E" : "#000"}
        />
        <Text style={styles.likeCount}>{item.likes}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Shh!</Text>
          <Text style={styles.subtitle}>Where whispers echo loudest</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* daftar whisper */}
      {/* daftar whisper (kotak nulis ikut ke-scroll) */}
      <FlatList
        data={whispers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.composer}>
            <TextInput
              style={styles.composerInput}
              placeholder="Bisikkan sesuatu..."
              placeholderTextColor="#888"
              multiline
              maxLength={MAX_LENGTH}
              value={text}
              onChangeText={setText}
            />
            <View style={styles.composerFooter}>
              <Text style={styles.counter}>
                {text.length}/{MAX_LENGTH}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.postButton,
                  !text.trim() && styles.postButtonDisabled,
                  pressed && styles.pressed,
                ]}
                onPress={handlePost}
                disabled={!text.trim()}
              >
                <Text style={styles.postText}>Whisper</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            Belum ada bisikan. Jadi yang pertama!
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#8B5FB0" },
  pressed: { opacity: 0.7 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 34, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  composer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
  },
  composerInput: {
    minHeight: 70,
    fontSize: 16,
    textAlignVertical: "top",
  },
  composerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  counter: { color: "#888", fontSize: 12, fontWeight: "600" },
  postButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  postButtonDisabled: { opacity: 0.4 },
  postText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  list: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B5FB0",
    alignItems: "center",
    justifyContent: "center",
  },
  anon: { fontWeight: "700", fontSize: 14, flex: 1 },
  time: { color: "#888", fontSize: 12 },
  whisperText: { fontSize: 16, lineHeight: 22, color: "#1a1a1a" },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  likeCount: { fontWeight: "600", fontSize: 14 },
  empty: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 40,
  },
});
