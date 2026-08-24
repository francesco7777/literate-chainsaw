import { useCallback, useEffect, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";
import { ClubInfo, Contact, Sponsor } from "@/types/database";
import { Screen, EmptyState } from "@/components/Screen";

const TIER_LABELS: Record<Sponsor["tier"], string> = {
  gold: "Gold-Sponsoren",
  silver: "Silber-Sponsoren",
  bronze: "Bronze-Sponsoren",
};

export default function VereinScreen() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [sponsorsRes, contactsRes, clubInfoRes] = await Promise.all([
      supabase.from("sponsors").select("*").order("sort_order"),
      supabase.from("contacts").select("*").order("sort_order"),
      supabase.from("club_info").select("*").eq("id", 1).single(),
    ]);
    if (sponsorsRes.data) setSponsors(sponsorsRes.data as Sponsor[]);
    if (contactsRes.data) setContacts(contactsRes.data as Contact[]);
    if (clubInfoRes.data) setClubInfo(clubInfoRes.data as ClubInfo);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = (["gold", "silver", "bronze"] as const)
    .map((tier) => ({ tier, items: sponsors.filter((s) => s.tier === tier) }))
    .filter((g) => g.items.length > 0);

  return (
    <Screen refreshing={loading} onRefresh={load}>
      <Section title="Kontakt & Vorstand">
        {clubInfo && (
          <View style={styles.card}>
            {clubInfo.address ? <InfoRow label="Adresse" value={clubInfo.address} /> : null}
            {clubInfo.email ? (
              <InfoRow label="E-Mail" value={clubInfo.email} onPress={() => Linking.openURL(`mailto:${clubInfo.email}`)} />
            ) : null}
            {clubInfo.phone ? (
              <InfoRow label="Telefon" value={clubInfo.phone} onPress={() => Linking.openURL(`tel:${clubInfo.phone}`)} />
            ) : null}
            {clubInfo.website ? (
              <InfoRow label="Website" value={clubInfo.website} onPress={() => Linking.openURL(clubInfo.website!)} />
            ) : null}
          </View>
        )}
        {contacts.length === 0 && !loading ? (
          <EmptyState message="Noch keine Kontakte erfasst." />
        ) : (
          contacts.map((c) => (
            <View key={c.id} style={styles.card}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactRole}>{c.role}</Text>
              {c.email ? (
                <Pressable onPress={() => Linking.openURL(`mailto:${c.email}`)}>
                  <Text style={styles.link}>{c.email}</Text>
                </Pressable>
              ) : null}
              {c.phone ? (
                <Pressable onPress={() => Linking.openURL(`tel:${c.phone}`)}>
                  <Text style={styles.link}>{c.phone}</Text>
                </Pressable>
              ) : null}
            </View>
          ))
        )}
      </Section>

      <Section title="Sponsoren">
        {grouped.length === 0 && !loading ? (
          <EmptyState message="Noch keine Sponsoren erfasst." />
        ) : (
          grouped.map((g) => (
            <View key={g.tier} style={{ gap: 8 }}>
              <Text style={styles.tierTitle}>{TIER_LABELS[g.tier]}</Text>
              <View style={styles.sponsorGrid}>
                {g.items.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.sponsorCard}
                    onPress={() => s.website_url && Linking.openURL(s.website_url)}
                  >
                    {s.logo_url ? (
                      <Image source={{ uri: s.logo_url }} style={styles.sponsorLogo} resizeMode="contain" />
                    ) : (
                      <Text style={styles.sponsorName}>{s.name}</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        )}
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  const content = (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { color: colors.textMuted, fontSize: 13, fontWeight: "500" },
  infoValue: { color: colors.text, fontSize: 13, fontWeight: "700" },
  contactName: { fontSize: 16, fontWeight: "800", color: colors.text },
  contactRole: { fontSize: 13, color: colors.textMuted, marginBottom: 4, fontWeight: "500" },
  link: { color: colors.blue, fontSize: 13, fontWeight: "700" },
  tierTitle: { fontSize: 13, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.3 },
  sponsorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  sponsorCard: {
    width: "47%",
    aspectRatio: 2,
    backgroundColor: colors.card,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  sponsorLogo: { width: "100%", height: "100%" },
  sponsorName: { fontSize: 13, fontWeight: "700", color: colors.text, textAlign: "center" },
});
