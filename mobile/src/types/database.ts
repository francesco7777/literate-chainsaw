export type Team = {
  id: string;
  name: string;
  category: string;
  league: string | null;
  sort_order: number;
};

export type Player = {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  position: string | null;
  jersey_number: number | null;
  photo_url: string | null;
  sort_order: number;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string | null;
  content: string;
  image_url: string | null;
  author: string | null;
  published_at: string;
};

export type Match = {
  id: string;
  team_id: string;
  opponent: string;
  home_away: "home" | "away";
  competition: string | null;
  location: string | null;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  status: "scheduled" | "finished" | "cancelled" | "postponed";
};

export type Sponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: "gold" | "silver" | "bronze";
  sort_order: number;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  sort_order: number;
};

export type ClubInfo = {
  id: number;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
};
