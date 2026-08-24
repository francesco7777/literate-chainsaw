import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { Player } from "@/types/database";
import { Screen, EmptyState } from "@/components/Screen";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", id)
        .order("sort_order");
      if (data) setPlayers(data as Player[]);
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

  return (
    <Screen>
      {players.length === 0 && <EmptyState message="Noch kein Kader erfasst." />}
      {players.map((p) => (
        <View key={p.id} style={styles.row}>
          {p.photo_url ? (
            <Image source={{ uri: p.photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitials}>
                {p.first_name[0]}
                {p.last_name[0]}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {p.first_name} {p.last_name}
            </Text>
            {p.position ? <Text style={styles.meta}>{p.position}</Text> : null}
          </View>
          {p.jersey_number !== null && (
            <View style={styles.numberBadge}>
              <Text style={styles.number}>{p.jersey_number}</Text>
            </View>
          )}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.background },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: colors.blue },
  avatarInitials: { color: colors.white, fontWeight: "800", fontSize: 14 },
  name: { fontSize: 15, fontWeight: "700", color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },
  numberBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  number: { fontSize: 15, fontWeight: "800", color: colors.onDark },
});
