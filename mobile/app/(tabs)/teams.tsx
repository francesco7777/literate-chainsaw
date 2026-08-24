import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { Team } from "@/types/database";
import { Screen, EmptyState } from "@/components/Screen";

export default function TeamsScreen() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("teams").select("*").order("sort_order");
    if (data) setTeams(data as Team[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen refreshing={loading} onRefresh={load}>
      {teams.length === 0 && !loading && <EmptyState message="Noch keine Teams erfasst." />}
      {teams.map((team) => (
        <Pressable key={team.id} style={styles.card} onPress={() => router.push(`/teams/${team.id}`)}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{team.category[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{team.name}</Text>
            <Text style={styles.meta}>
              {team.category}
              {team.league ? ` · ${team.league}` : ""}
            </Text>
          </View>
          <View style={styles.chevronWrap}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.white, fontSize: 17, fontWeight: "800" },
  name: { fontSize: 16, fontWeight: "800", color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 2, fontWeight: "500" },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: { fontSize: 18, color: colors.textMuted, fontWeight: "700" },
});
