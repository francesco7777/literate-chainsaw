import { PropsWithChildren } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type Props = PropsWithChildren<{
  refreshing?: boolean;
  onRefresh?: () => void;
}>;

export function Screen({ children, refreshing, onRefresh }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.green} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  empty: { padding: 32, alignItems: "center" },
  emptyText: { color: colors.textMuted, fontSize: 15, textAlign: "center" },
});
