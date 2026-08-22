import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { NewsItem } from "@/types/database";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("news").select("*").eq("id", id).single();
      setItem(data as NewsItem);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Beitrag nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {new Date(item.published_at).toLocaleDateString("de-CH")}
          {item.author ? ` · ${item.author}` : ""}
        </Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: 220 },
  body: { padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted },
  content: { fontSize: 16, lineHeight: 24, color: colors.text, marginTop: 8 },
});
