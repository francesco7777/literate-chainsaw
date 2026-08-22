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
            <Text style={styles.number}>{p.jersey_number}</Text>
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
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  avatarInitials: { color: colors.blue, fontWeight: "700" },
  name: { fontSize: 15, fontWeight: "600", color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted },
  number: { fontSize: 18, fontWeight: "800", color: colors.red, minWidth: 28, textAlign: "right" },
});
