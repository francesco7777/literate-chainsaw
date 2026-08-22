import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { NewsItem } from "@/types/database";
import { Screen, EmptyState } from "@/components/Screen";

export default function NewsScreen() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error && data) setNews(data as NewsItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen refreshing={loading} onRefresh={load}>
      {news.length === 0 && !loading && (
        <EmptyState message="Noch keine News vorhanden." />
      )}
      {news.map((item) => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() => router.push(`/news/${item.id}`)}
        >
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : null}
          <View style={styles.cardBody}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>
              {new Date(item.published_at).toLocaleDateString("de-CH")}
              {item.author ? ` · ${item.author}` : ""}
            </Text>
            <Text style={styles.excerpt} numberOfLines={2}>
              {item.content}
            </Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: "100%", height: 160 },
  cardBody: { padding: 14, gap: 4 },
  title: { fontSize: 17, fontWeight: "700", color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted },
  excerpt: { fontSize: 14, color: colors.text, marginTop: 4 },
});
