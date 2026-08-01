alter table portfolio_items
  add column if not exists featured boolean not null default false;