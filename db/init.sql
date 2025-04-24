create table users (
  id bigint primary key generated always as identity,
  name text not null,
  last_name text not null,
  username text not null unique,
  email text not null unique,
  password text not null,
  img_url text,
  cognito_id text unique
);

create table files (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  file_name text not null,
  file_type text not null,
  s3_path text not null,
  uploaded_at timestamptz default now()
);

create table transcriptions (
  id bigint primary key generated always as identity,
  file_id bigint references files (id),
  content text not null,
  language text not null,
  created_at timestamptz default now()
);

create table translations (
  id bigint primary key generated always as identity,
  transcription_id bigint references transcriptions (id),
  translated_content text not null,
  target_language text not null,
  created_at timestamptz default now()
);

create table audio_readings (
  id bigint primary key generated always as identity,
  transcription_id bigint references transcriptions (id),
  audio_file text not null,
  voice text not null,
  created_at timestamptz default now()
);

create table user_sessions (
  id bigint primary key generated always as identity,
  user_id bigint references users(id) on delete cascade,
  token text not null,
  created_at timestamptz default now()
);