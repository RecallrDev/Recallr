-- Create a new storage bucket for avatars (private)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false);

-- Set up storage policies for the avatars bucket
create policy "Authenticated users can view avatars"
on storage.objects for select
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = name
  and not exists (
    select 1 from storage.objects
    where bucket_id = 'avatars'
    and name = auth.uid()::text
  )
);

create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = name
);

create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = name
);