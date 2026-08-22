-- Optional starter content — run after 0001_init.sql if you want the app
-- to show something before the admin team enters real data.

insert into public.teams (name, category, league, sort_order) values
  ('1. Mannschaft', 'Aktive', '4. Liga', 1),
  ('2. Mannschaft', 'Aktive', '5. Liga', 2),
  ('Junioren A', 'Junioren', null, 3),
  ('Junioren B', 'Junioren', null, 4)
on conflict do nothing;

update public.club_info set
  address = 'Erlinsbach, Schweiz',
  email = 'info@fcerlinsbach.ch',
  website = 'https://fcerlinsbach.ch'
where id = 1;
