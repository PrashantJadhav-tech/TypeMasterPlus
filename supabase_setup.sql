-- TypeMasterPlus: run this SQL once in Supabase SQL Editor.
-- IMPORTANT: replace YOUR_ADMIN_EMAIL with the Gmail/email you want to be the first admin.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  is_super_admin boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
  set username = coalesce(public.profiles.username, excluded.username),
      email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Create profile rows for users who already existed before this feature.
insert into public.profiles (id, username, email, created_at)
select
  id,
  coalesce(raw_user_meta_data->>'username', split_part(email, '@', 1)),
  email,
  created_at
from auth.users
on conflict (id) do update
set email = excluded.email;

-- Super Admin protection: only the Super Admin can never be demoted/removed.
alter table public.profiles add column if not exists is_super_admin boolean not null default false;

-- Admins can promote/demote other users, but cannot remove their own access or the Super Admin.
create or replace function public.set_admin_role(target_user_id uuid, make_admin boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only an administrator can change admin access';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'You cannot change your own admin access';
  end if;

  if exists (select 1 from public.profiles where id = target_user_id and is_super_admin = true) then
    raise exception 'The Super Admin cannot be demoted or removed';
  end if;

  update public.profiles
  set role = case when make_admin then 'admin' else 'user' end,
      updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'User profile not found';
  end if;
end;
$$;

revoke all on function public.set_admin_role(uuid, boolean) from public;
grant execute on function public.set_admin_role(uuid, boolean) to authenticated;

-- Make your first administrator:
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = lower('YOUR_ADMIN_EMAIL');

-- Mark the same account as the protected Super Admin. Replace YOUR_ADMIN_EMAIL with your email.
update public.profiles
set is_super_admin = true, role = 'admin', updated_at = now()
where lower(email) = lower('YOUR_ADMIN_EMAIL');

-- Profile-photo storage.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
