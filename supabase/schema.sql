-- dailySports — Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  bio text,
  favorite_teams text[] default '{}',
  is_creator boolean default false,
  creator_platform text,
  creator_handle text,
  creator_sport text,
  creator_followers text,
  creator_description text,
  creator_schedule jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SAVED ARTICLES
-- ============================================================
create table if not exists public.saved_articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  article_id text not null,
  title text not null,
  link text not null,
  source text,
  category text,
  image_url text,
  pub_date timestamptz,
  created_at timestamptz default now(),
  unique(user_id, article_id)
);

alter table public.saved_articles enable row level security;

create policy "Users can manage their own saved articles" on public.saved_articles
  for all using (auth.uid() = user_id);

-- ============================================================
-- FAVORITE CREATORS
-- ============================================================
create table if not exists public.favorite_creators (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, creator_id)
);

alter table public.favorite_creators enable row level security;

create policy "Users can manage their own favorite creators" on public.favorite_creators
  for all using (auth.uid() = user_id);

-- ============================================================
-- FORUM THREADS
-- ============================================================
create table if not exists public.forum_threads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic text not null,
  title text not null,
  content text,
  pinned boolean default false,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.forum_threads enable row level security;

create policy "Forum threads are viewable by everyone" on public.forum_threads
  for select using (true);

create policy "Authenticated users can create threads" on public.forum_threads
  for insert with check (auth.uid() = user_id);

create policy "Authors can update their threads" on public.forum_threads
  for update using (auth.uid() = user_id);

-- ============================================================
-- FORUM REPLIES
-- ============================================================
create table if not exists public.forum_replies (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references public.forum_threads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.forum_replies enable row level security;

create policy "Forum replies are viewable by everyone" on public.forum_replies
  for select using (true);

create policy "Authenticated users can create replies" on public.forum_replies
  for insert with check (auth.uid() = user_id);

create policy "Authors can update their replies" on public.forum_replies
  for update using (auth.uid() = user_id);

-- ============================================================
-- CREATOR POSTS (for creators to publish their content)
-- ============================================================
create table if not exists public.creator_posts (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  platform text not null,
  thumbnail_url text,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.creator_posts enable row level security;

create policy "Creator posts are viewable by everyone" on public.creator_posts
  for select using (true);

create policy "Creators can manage their own posts" on public.creator_posts
  for all using (auth.uid() = creator_id);

-- ============================================================
-- USER FAVORITES (sports, leagues, teams)
-- ============================================================
create table if not exists public.user_favorites (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  type       text not null check (type in ('sport', 'league', 'team', 'creator', 'player')),
  value      text not null,
  created_at timestamptz default now() not null,
  unique(user_id, type, value)
);

alter table public.user_favorites enable row level security;

create policy "Users can manage their own favorites" on public.user_favorites
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_forum_threads_topic on public.forum_threads(topic);
create index if not exists idx_forum_threads_created_at on public.forum_threads(created_at desc);
create index if not exists idx_forum_replies_thread_id on public.forum_replies(thread_id);
create index if not exists idx_saved_articles_user_id on public.saved_articles(user_id);
create index if not exists idx_creator_posts_creator_id on public.creator_posts(creator_id);
create index if not exists idx_user_favorites_user_id on public.user_favorites(user_id);
