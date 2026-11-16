function tryParseJson(val) {
  if (typeof val !== 'string') return val;
  try { return JSON.parse(val); } catch (_) { return null; }
}

function normKey(item) {
  if (!item || typeof item !== 'object') return '';
  if (item.id !== undefined && item.id !== null && String(item.id) !== '') return `id:${item.id}`;
  const name = String(item.name || item.athleteName || item.playerName || item.title || '').trim().toLowerCase();
  const div = String(item.division || item.team || '').trim().toLowerCase();
  return name ? `nm:${name}|${div}` : '';
}

function isPaidLike(val) {
  return /^(paid|complete|completed|true|yes)$/i.test(String(val ?? '').trim());
}

function mergeArrayRecords(liveArr, incomingArr, isAdminPublish = false) {
  if (!Array.isArray(liveArr)) return Array.isArray(incomingArr) ? incomingArr : [];
  if (!Array.isArray(incomingArr)) return liveArr;

  const map = new Map();
  liveArr.forEach((item, idx) => {
    const k = normKey(item) || `idx:${idx}`;
    map.set(k, structuredClone(item));
  });

  incomingArr.forEach((inc, idx) => {
    const k = normKey(inc) || `idx:${idx}`;
    if (!map.has(k)) {
      map.set(k, structuredClone(inc));
      return;
    }
    const existing = map.get(k);
    if (typeof existing !== 'object' || typeof inc !== 'object' || !existing || !inc) {
      map.set(k, structuredClone(inc));
      return;
    }

    const merged = { ...existing, ...inc };

    // Deep-merge nested rosters/players/athletes arrays
    ['roster', 'players', 'athletes', 'members'].forEach(subKey => {
      if (Array.isArray(existing[subKey]) || Array.isArray(inc[subKey])) {
        merged[subKey] = mergeArrayRecords(existing[subKey] || [], inc[subKey] || [], isAdminPublish);
      }
    });

    // Always preserve live-entered uniform, jersey, size, and fundraiser data if incoming is blank/zero/false
    ['jersey', 'jerseyNumber', 'number', 'size', 'uniformSize', 'notes'].forEach(f => {
      if ((!inc[f] || String(inc[f]).trim() === '') && existing[f] !== undefined && String(existing[f]).trim() !== '') {
        merged[f] = existing[f];
      }
    });
    ['uniformPaid', 'fundraiserPaid', 'fundraiserAmount', 'fundraisers'].forEach(f => {
      if ((inc[f] === undefined || inc[f] === null || inc[f] === false || Number(inc[f]) === 0) && existing[f]) {
        merged[f] = existing[f];
      }
    });

    // Never downgrade a live Paid/Complete registration or payment back to unpaid during an admin publish
    if (isAdminPublish) {
      if (isPaidLike(existing.paymentStatus) && !isPaidLike(inc.paymentStatus)) {
        merged.paymentStatus = existing.paymentStatus;
      }
      if (isPaidLike(existing.payment) && !isPaidLike(inc.payment)) {
        merged.payment = existing.payment;
      }
      if (existing.paid === true || existing.regPaid === true) {
        merged.paid = true;
        merged.regPaid = true;
      }
      if (isPaidLike(existing.status) && !isPaidLike(inc.status)) {
        merged.status = existing.status;
      }
    } else {
      // Background live-site sync: keep admin-configured schedules, courts, coaches, divisions, and fees intact
      ['practiceDay', 'practiceTime', 'halfCourt', 'practiceLocation', 'practiceDay2', 'practiceTime2', 'halfCourt2', 'practiceLocation2', 'coach', 'division', 'fee'].forEach(adminField => {
        if (existing[adminField] !== undefined && existing[adminField] !== '') {
          merged[adminField] = existing[adminField];
        }
      });
    }

    map.set(k, merged);
  });

  return Array.from(map.values());
}

function deepMergePayloads(livePayload, incomingPayload, isAdminPublish = true) {
  const result = { ...(livePayload || {}) };
  if (!incomingPayload || typeof incomingPayload !== 'object') return result;

  Object.entries(incomingPayload).forEach(([storageKey, rawVal]) => {
    if (storageKey === '__cyo_publish_key') return;
    if (!(storageKey in result) || !result[storageKey]) {
      result[storageKey] = rawVal;
      return;
    }

    const liveParsed = tryParseJson(result[storageKey]);
    const incParsed = tryParseJson(rawVal);

    if (liveParsed && incParsed && typeof liveParsed === 'object' && typeof incParsed === 'object' && !Array.isArray(liveParsed) && !Array.isArray(incParsed)) {
      const mergedObj = { ...liveParsed, ...incParsed };
      ['teams', 'registrations', 'players', 'athletes', 'coaches', 'volunteers', 'events', 'games', 'schedule'].forEach(arrKey => {
        if (Array.isArray(liveParsed[arrKey]) || Array.isArray(incParsed[arrKey])) {
          mergedObj[arrKey] = mergeArrayRecords(liveParsed[arrKey] || [], incParsed[arrKey] || [], isAdminPublish);
        }
      });
      if (!isAdminPublish) {
        ['seasonFee', 'registrationFee', 'seasons', 'orgName', 'parish', 'city', 'email', 'phone'].forEach(cfgKey => {
          if (liveParsed[cfgKey] !== undefined) mergedObj[cfgKey] = liveParsed[cfgKey];
        });
      }
      result[storageKey] = typeof rawVal === 'string' ? JSON.stringify(mergedObj) : mergedObj;
    } else {
      result[storageKey] = rawVal;
    }
  });

  return result;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/api/state') {
      if (request.method === 'GET') {
        const raw = await env.CYO_STATE.get('live_state');
        return new Response(raw || 'null', {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        });
      }

      if (request.method === 'POST') {
        const auth = request.headers.get('Authorization') || '';
        if (!env.PUBLISH_KEY || auth !== `Bearer ${env.PUBLISH_KEY}`) {
          return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const incomingText = await request.text();
        const incomingObj = tryParseJson(incomingText) || {};
        const existingRaw = await env.CYO_STATE.get('live_state');
        const existingObj = tryParseJson(existingRaw) || {};

        // Save an automatic pre-publish backup in KV before writing
        if (existingRaw) {
          await env.CYO_STATE.put('live_state_backup', existingRaw);
        }

        const mergedPayload = deepMergePayloads(existingObj, incomingObj, true);
        const serialized = JSON.stringify(mergedPayload);
        await env.CYO_STATE.put('live_state', serialized);

        return new Response(JSON.stringify({ ok: true, publishedAt: new Date().toISOString(), mergedState: mergedPayload }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Endpoint for live site (stanns.opp-solutions.com) to persist coach/registration edits into KV
    if (url.pathname === '/api/live-merge' && request.method === 'POST') {
      const incomingText = await request.text();
      const incomingObj = tryParseJson(incomingText) || {};
      const existingRaw = await env.CYO_STATE.get('live_state');
      const existingObj = tryParseJson(existingRaw) || {};

      const mergedPayload = deepMergePayloads(existingObj, incomingObj, false);
      const serialized = JSON.stringify(mergedPayload);
      await env.CYO_STATE.put('live_state', serialized);

      return new Response(JSON.stringify({ ok: true, savedAt: new Date().toISOString(), mergedState: mergedPayload }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const res = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(res.headers);
    if (/\.(html|js|css)$/i.test(url.pathname) || url.pathname === '/') {
      newHeaders.set('Cache-Control', 'no-cache, must-revalidate');
    }
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders
    });
  }
};
