import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { Match, Team } from "@/types/database";
import { Screen, EmptyState } from "@/components/Screen";

export default function SpielplanScreen() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [teamsRes, matchesRes] = await Promise.all([
      supabase.from("teams").select("*").order("sort_order"),
      supabase.from("matches").select("*").order("match_date", { ascending: true }),
    ]);
    if (teamsRes.data) setTeams(teamsRes.data as Team[]);
    if (matchesRes.data) setMatches(matchesRes.data as Match[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => (selectedTeam === "all" ? matches : matches.filter((m) => m.team_id === selectedTeam)),
    [matches, selectedTeam]
  );

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? "";

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        <FilterChip label="Alle" active={selectedTeam === "all"} onPress={() => setSelectedTeam("all")} />
        {teams.map((t) => (
          <FilterChip key={t.id} label={t.name} active={selectedTeam === t.id} onPress={() => setSelectedTeam(t.id)} />
        ))}
      </ScrollView>

      <Screen refreshing={loading} onRefresh={load}>
        {filtered.length === 0 && !loading && <EmptyState message="Keine Spiele gefunden." />}
        {filtered.map((m) => (
          <View key={m.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.team}>{teamName(m.team_id)}</Text>
              <StatusBadge status={m.status} />
            </View>
            <Text style={styles.opponent}>
              {m.home_away === "home" ? "FC Erlinsbach" : m.opponent} vs.{" "}
              {m.home_away === "home" ? m.opponent : "FC Erlinsbach"}
            </Text>
            <Text style={styles.meta}>
              {new Date(m.match_date).toLocaleString("de-CH", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {m.location ? ` · ${m.location}` : ""}
            </Text>
            {m.status === "finished" && m.home_score !== null && m.away_score !== null && (
              <Text style={styles.score}>
                {m.home_score} : {m.away_score}
              </Text>
            )}
          </View>
        ))}
      </Screen>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function StatusBadge({ status }: { status: Match["status"] }) {
  const labels: Record<Match["status"], string> = {
    scheduled: "Geplant",
    finished: "Beendet",
    cancelled: "Abgesagt",
    postponed: "Verschoben",
  };
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: { paddingVertical: 12, flexGrow: 0 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: colors.white },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  team: { fontSize: 13, fontWeight: "700", color: colors.blue, textTransform: "uppercase" },
  opponent: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 2 },
  meta: { fontSize: 13, color: colors.textMuted },
  score: { fontSize: 20, fontWeight: "800", color: colors.red, marginTop: 4 },
  badge: { backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
});
