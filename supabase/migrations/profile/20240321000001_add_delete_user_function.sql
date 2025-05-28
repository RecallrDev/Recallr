-- Create a function to delete the current user
create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _user_id uuid;
begin
  -- Get the current user's ID
  _user_id := auth.uid();
  
  -- Check if user exists
  if _user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete all cards belonging to user's decks
  delete from public.basic_cards
  where deck_id in (
    select id from public.decks where user_id = _user_id
  );

  -- Delete all decks belonging to the user
  delete from public.decks where user_id = _user_id;

  -- Delete the user's profile
  delete from public.profiles where id = _user_id;

  -- Delete the user's avatar from storage if it exists
  delete from storage.objects 
  where bucket_id = 'avatars' 
  and name = _user_id::text;

  -- Finally, delete the auth user
  delete from auth.users where id = _user_id;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user() to authenticated;

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant usage on schema storage to authenticated;
grant select, delete on storage.objects to authenticated; 