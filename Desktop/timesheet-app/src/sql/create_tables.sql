-- プロジェクトテーブルの作成
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  status text not null check (status in ('active', 'completed', 'on_hold')),
  tags text[] default '{}',
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシーの設定
alter table projects enable row level security;

-- 更新トリガーの作成
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();
