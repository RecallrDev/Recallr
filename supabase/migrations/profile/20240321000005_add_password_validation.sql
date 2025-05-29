-- Create a function to validate and update password
create or replace function public.validate_and_update_password(
  current_password text,
  new_password text
)
returns void
language plpgsql
security definer
as $$
declare
  _user_id uuid;
begin
  -- Get current user
  _user_id := auth.uid();
  if _user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Validate new password
  if length(new_password) < 8 then
    raise exception 'Password must be at least 8 characters long';
  end if;

  -- Update password using auth.users
  update auth.users
  set encrypted_password = crypt(new_password, gen_salt('bf'))
  where id = _user_id
  and encrypted_password = crypt(current_password, encrypted_password);

  -- Check if any row was updated
  if not found then
    raise exception 'Current password is incorrect';
  end if;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.validate_and_update_password(text, text) to authenticated; 