-- decided not to use sql-migrate because remote sqlite is annoying

create table if not exists users (
  id text not null,
  email text unique not null,

  email_on_post boolean not null default true,
  subscription text,

  created timestamptz default CURRENT_TIMESTAMP not null,

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

  created timestamptz default CURRENT_TIMESTAMP not null,

  primary key (collection, id)
)
;

create unique index if not exists documents_by_slug on documents(collection, slug);

-- storing anything we'd proxy to segment
create table if not exists analytics_events (
  id text not null,
  payload json,

  created timestamptz default CURRENT_TIMESTAMP not null,

  primary key (id)
)
;

-- for storing all stripe events we get
create table if not exists stripe_webhooks (
  id text not null,
  event text not null,
  payload json,

  created timestamptz default CURRENT_TIMESTAMP not null,

  primary key (id)
)
;


create table if not exists signin_codes (
  code text not null,
  email text not null,

  created timestamptz default CURRENT_TIMESTAMP not null,

  primary key(code)
)
;
