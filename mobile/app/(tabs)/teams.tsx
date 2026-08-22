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
          <View>
            <Text style={styles.name}>{team.name}</Text>
            <Text style={styles.meta}>
              {team.category}
              {team.league ? ` · ${team.league}` : ""}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 17, fontWeight: "700", color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  chevron: { fontSize: 24, color: colors.textMuted },
});
