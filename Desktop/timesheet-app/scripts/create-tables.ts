import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  const sql = `
    create extension if not exists "uuid-ossp";

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

    alter table projects enable row level security;

    create policy "Enable read access for all users"
      on projects for select
      using (true);

    create policy "Enable insert access for authenticated users"
      on projects for insert
      with check (true);

    create policy "Enable update access for authenticated users"
      on projects for update
      using (true);

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
  `;

  const { error } = await supabase.auth.admin.executeSql(sql);

  if (error) {
    console.error("Error creating tables:", error);
    return;
  }

  console.log("Tables created successfully");
}

createTables().catch(console.error);
