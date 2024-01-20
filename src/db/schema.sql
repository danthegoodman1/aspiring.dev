-- decided not to use sql-migrate because remote sqlite is annoying

create table if not exists users (
  id text not null,
  email text unique not null,

  email_on_post boolean not null default true,
  subscription text,

  primary key (id)
)
;

create table if not exists documents (
  collection text not null,
  id text not null,
  version int8 not null default 0,
  published boolean not null default false,
  slug text not null,
  name text not null,
  description text,
  banner_path text,
  markdown_path text not null,
  created_ms int8,

  primary key (collection, id)
)
;

create unique index if not exists documents_by_slug on documents(collection, slug);

-- storing anything we'd proxy to segment
create table if not exists analytics_events (
  id text not null,
  created_ms int8 not null,
  payload json,

  primary key (id)
)
;

-- for storing all stripe events we get
create table if not exists stripe_webhooks (
  id text not null,
  event text not null,
  created_ms int8 not null,
  payload json,

  primary key (id)
)
;
