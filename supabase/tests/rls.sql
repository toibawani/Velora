begin;

insert into auth.users (id, email) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a@test.dev'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b@test.dev');

select set_config('request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}', true);
set local role authenticated;
insert into public.progress_events (topic_id, kind) values ('black-holes', 'lesson_read');
insert into public.explanations (topic_id, body)
  values ('black-holes', 'A black hole is a place where escape speed passes light speed.');
reset role;

select set_config('request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}', true);
set local role authenticated;

do $$
declare n int; blocked boolean;
begin
  select count(*) into n from public.progress_events;
  if n <> 0 then raise exception 'FAIL: B can read A progress'; end if;

  select count(*) into n from public.explanations;
  if n <> 0 then raise exception 'FAIL: B can read A pending explanation'; end if;

  blocked := false;
  begin
    insert into public.progress_events (user_id, topic_id, kind)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'x', 'lesson_read');
  exception when others then blocked := true; end;
  if not blocked then raise exception 'FAIL: B inserted progress as A'; end if;

  blocked := false;
  begin
    insert into public.explanations (topic_id, body, status)
    values ('x', 'I am trying to approve my own explanation.', 'approved');
  exception when others then blocked := true; end;
  if not blocked then raise exception 'FAIL: B inserted an approved explanation'; end if;

  blocked := false;
  begin
    update public.explanations set status = 'approved';
  exception when others then blocked := true; end;
  if not blocked then raise exception 'FAIL: B can update explanation status'; end if;

  blocked := false;
  begin
    insert into public.explanations (topic_id, body) values ('x', 'too short');
  exception when others then blocked := true; end;
  if not blocked then raise exception 'FAIL: length check not enforced'; end if;
end $$;

reset role;

select 'ALL RLS TESTS PASSED' as result;
rollback;
