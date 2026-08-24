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
            <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imageFallback} />
          )}
          <View style={styles.scrim}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {new Date(item.published_at).toLocaleDateString("de-CH")}
              {item.author ? ` · ${item.author}` : ""}
            </Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.ink,
    minHeight: 200,
    justifyContent: "flex-end",
  },
  image: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  imageFallback: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.greenDark },
  scrim: {
    backgroundColor: "rgba(11,13,12,0.72)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  title: { fontSize: 18, fontWeight: "800", color: colors.onDark },
  meta: { fontSize: 12, color: colors.onDarkMuted, fontWeight: "600" },
});
