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
        {filtered.map((m) => {
          const home = m.home_away === "home" ? "FCE" : initials(m.opponent);
          const away = m.home_away === "home" ? initials(m.opponent) : "FCE";
          const homeName = m.home_away === "home" ? "Erlinsbach" : m.opponent;
          const awayName = m.home_away === "home" ? m.opponent : "Erlinsbach";
          const finished = m.status === "finished" && m.home_score !== null && m.away_score !== null;

          return (
            <View key={m.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.competition}>{m.competition ?? teamName(m.team_id)}</Text>
                <StatusBadge status={m.status} />
              </View>

              <View style={styles.matchRow}>
                <TeamBadge initials={home} name={homeName} />
                <View style={styles.centerPill}>
                  {finished ? (
                    <Text style={styles.scoreText}>
                      {m.home_score} : {m.away_score}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.dateText}>
                        {new Date(m.match_date).toLocaleDateString("de-CH", { day: "2-digit", month: "short" }).toUpperCase()}
                      </Text>
                      <Text style={styles.timeText}>
                        {new Date(m.match_date).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </>
                  )}
                </View>
                <TeamBadge initials={away} name={awayName} />
              </View>

              {m.location ? <Text style={styles.location}>{m.location}</Text> : null}
            </View>
          );
        })}
      </Screen>
    </View>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function TeamBadge({ initials, name }: { initials: string; name: string }) {
  return (
    <View style={styles.teamBadgeWrap}>
      <View style={styles.teamBadge}>
        <Text style={styles.teamBadgeText}>{initials}</Text>
      </View>
      <Text style={styles.teamName} numberOfLines={1}>
        {name}
      </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.text, fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: colors.white },

  card: {
    backgroundColor: colors.ink,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  competition: { fontSize: 12, fontWeight: "800", color: colors.onDark, textTransform: "uppercase", letterSpacing: 0.3 },
  badge: { backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, color: colors.onDark, fontWeight: "700" },

  matchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  teamBadgeWrap: { flex: 1, alignItems: "center", gap: 8 },
  teamBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.onDark,
    alignItems: "center",
    justifyContent: "center",
  },
  teamBadgeText: { fontSize: 15, fontWeight: "800", color: colors.ink },
  teamName: { fontSize: 12, fontWeight: "700", color: colors.onDark, maxWidth: 88, textAlign: "center" },

  centerPill: {
    backgroundColor: colors.onDark,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 84,
  },
  dateText: { fontSize: 13, fontWeight: "800", color: colors.ink },
  timeText: { fontSize: 12, fontWeight: "600", color: colors.textMuted, marginTop: 1 },
  scoreText: { fontSize: 20, fontWeight: "800", color: colors.ink },

  location: { fontSize: 12, color: colors.onDarkMuted, textAlign: "center", fontWeight: "600" },
});
