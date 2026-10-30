insert into public.questions (id,category,text,sign,image_url,options,correct,explanation,difficulty,published,sort_order)
select (e->>'id')::uuid, e->>'category', e->>'text', e->>'sign', e->>'image_url', e->'options', (e->>'correct')::int, coalesce(e->>'explanation',''), (e->>'difficulty')::int, true, (e->>'sort_order')::int
from net._http_response r, jsonb_array_elements(r.content::jsonb) e
where r.status_code = 200 and r.content like '[%'
on conflict (id) do nothing;