# FC Erlinsbach App

App für den Fussballclub Erlinsbach (Verein seit 1928). Besteht aus drei Teilen:

- **`mobile/`** — Native Mobile App (iOS & Android) für Mitglieder/Fans: News, Spielplan & Resultate, Teams & Kader, Sponsoren & Kontakt. Gebaut mit [Expo](https://expo.dev) / React Native.
- **`admin/`** — Web-basiertes Admin-Backend für den Vorstand, um Inhalte zu pflegen (News schreiben, Spiele/Resultate eintragen, Kader verwalten, Sponsoren & Kontakte pflegen). Gebaut mit Next.js.
- **`supabase/`** — Datenbankschema (Postgres via [Supabase](https://supabase.com)), das beide Apps gemeinsam nutzen.

Beide Apps teilen sich dieselbe Supabase-Datenbank: was im Admin-Backend eingetragen wird, erscheint direkt in der App.

## 1. Supabase-Projekt einrichten (einmalig)

1. Kostenloses Konto auf [supabase.com](https://supabase.com) erstellen.
2. Neues Projekt anlegen (Name z.B. `fc-erlinsbach`, Region z.B. Frankfurt).
3. Im Supabase-Dashboard unter **SQL Editor** den Inhalt von [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) einfügen und ausführen. Das erstellt alle Tabellen, Sicherheitsregeln (RLS) und den Speicher-Bucket für Bilder.
4. Optional: Inhalt von [`supabase/seed.sql`](supabase/seed.sql) ausführen für ein paar Beispiel-Teams.
5. Unter **Project Settings → API** findest du:
   - `Project URL`
   - `anon public` Key
   Diese beiden Werte brauchst du gleich für `mobile/.env` und `admin/.env.local`.
6. Einen Admin-Zugang anlegen: **Authentication → Users → Add user** (E-Mail + Passwort). Beim ersten Login wird automatisch ein Profil mit Admin-Rechten erstellt (siehe Trigger in der Migration). Nur eingeladene Nutzer können sich einloggen und Inhalte bearbeiten — die App selbst ist ohne Login öffentlich lesbar.

## 2. Admin-Backend lokal starten

```bash
cd admin
cp .env.example .env.local
# .env.local mit deiner Supabase Project URL + anon key befüllen
npm install
npm run dev
```

Öffnet auf `http://localhost:3000` — Login mit dem in Schritt 1.6 erstellten Konto.

Für den Produktivbetrieb: auf [Vercel](https://vercel.com) deployen (gleiche Env-Variablen dort setzen).

## 3. Mobile App lokal starten

```bash
cd mobile
cp .env.example .env
# .env mit deiner Supabase Project URL + anon key befüllen
npm install
npm run start
```

Das startet den Expo-Entwicklungsserver. Mit der [Expo Go](https://expo.dev/go) App auf dem Handy den QR-Code scannen, oder `npm run ios` / `npm run android` für einen Simulator.

### App im App Store / Play Store veröffentlichen

Sobald die App fertig getestet ist:

```bash
npx eas build --platform ios
npx eas build --platform android
```

(benötigt ein kostenloses [Expo/EAS](https://expo.dev/eas) Konto). Danach mit `eas submit` in die Stores hochladen — dafür braucht es einen Apple Developer Account (99 $/Jahr) und einen Google Play Console Account (25 $ einmalig).

## Datenmodell

| Tabelle | Zweck |
|---|---|
| `teams` | Mannschaften (Aktive, Junioren, etc.) |
| `players` | Kader pro Team |
| `news` | Vereinsnachrichten / Matchberichte |
| `matches` | Spielplan mit Resultaten |
| `sponsors` | Sponsoren nach Stufe (Gold/Silber/Bronze) |
| `contacts` | Vorstand / Ansprechpersonen |
| `club_info` | Allgemeine Vereinsangaben (Adresse, Kontakt, Social Media) |

Alle Tabellen sind öffentlich lesbar; Schreibzugriff nur für eingeloggte Admins (Row Level Security).

## Vereinsfarben

Aus dem Vereinswappen abgeleitet — in `mobile/src/theme/colors.ts` und `admin/src/app/globals.css` zentral definiert:

- Grün `#1E7B3B`
- Blau `#1B3A6B`
- Rot `#D0102A`

Farben oder Logo ändern sich zentral an diesen zwei Stellen.
