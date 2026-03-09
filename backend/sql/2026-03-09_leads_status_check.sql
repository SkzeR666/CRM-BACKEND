-- Padroniza status de leads e recria o check constraint.
-- Execute este script no SQL Editor do Supabase.

begin;

-- Normaliza para minúsculas e remove espaços extras.
update public.leads
set status = lower(trim(status))
where status is not null;

-- Mapeia valores legados em PT/variações para o padrão em inglês.
update public.leads
set status = case
  when status in ('novo', 'new') then 'new'
  when status in ('contatado', 'contacted') then 'contacted'
  when status in ('qualificado', 'qualified') then 'qualified'
  when status in ('negociando', 'negotiating') then 'negotiating'
  when status in ('fechado', 'ganho', 'won') then 'won'
  when status in ('perdido', 'lost') then 'lost'
  else status
end
where status is not null;

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (
    status is null
    or status in ('new', 'contacted', 'qualified', 'negotiating', 'won', 'lost')
  );

alter table public.leads
  alter column status set default 'new';

commit;
