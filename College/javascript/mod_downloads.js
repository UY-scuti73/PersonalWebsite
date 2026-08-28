// downloads_total.js
// Node.js 18+ (built-in fetch)

const SPIGOT_AUTHOR_ID = 1064717; // bowser_the_boss (Spiget author ID)
const SPIGOT_BASE_URL = "https://api.spiget.org/v2";

const CURSEFORGE_BASE_URL = "https://api.curseforge.com/v1";
const CURSEFORGE_AUTHOR_ID = 1064717;
const CURSEFORGE_GAME_ID = 432; // Minecraft
const CURSEFORGE_API_KEY = process.env.CURSEFORGE_API_KEY;

const MODRINTH_USER = "Bowser_The_Boss";
const MODRINTH_BASE_URL = "https://api.modrinth.com/v2";

const GEODE_MOD_URL = "https://geode-sdk.org/mods/bowser.betterpause";

async function fetchJson(url, { headers, params } = {}) {
    const u = new URL(url);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
        }
    }

    const res = await fetch(u, { headers });
    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Request failed ${res.status} ${res.statusText} for ${u.toString()}\n${body}`);
    }
    return res.json();
}

async function fetchText(url, { headers } = {}) {
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Request failed ${res.status} ${res.statusText} for ${url}\n${body}`);
    }
    return res.text();
}

/* =========================
   SPIGOT (Spiget API)
   ========================= */

async function getSpigotResources(authorId) {
    return fetchJson(`${SPIGOT_BASE_URL}/authors/${authorId}/resources`, {
        params: { size: 500 },
    });
}

async function getTotalDownloadsSpigot(authorId = SPIGOT_AUTHOR_ID) {
    const resources = await getSpigotResources(authorId);

    let total = 0;

    for (const res of resources) {
        let downloads = res?.downloads;
        const resId = res?.id;

        // Fallback: if downloads missing, fetch full resource
        if ((downloads === undefined || downloads === null) && resId != null) {
            const full = await fetchJson(`${SPIGOT_BASE_URL}/resources/${resId}`);
            downloads = full?.downloads ?? 0;
        }

        total += Number(downloads || 0);
    }

    return total;
}

/* =========================
   CURSEFORGE (official API)
   ========================= */

async function getCurseForgeResources(authorId, gameId = CURSEFORGE_GAME_ID) {
    if (!CURSEFORGE_API_KEY) {
        throw new Error(
            "Missing CURSEFORGE_API_KEY env var. Set it before running (required by CurseForge API)."
        );
    }

    const headers = {
        "x-api-key": CURSEFORGE_API_KEY,
        "Accept": "application/json",
    };

    const pageSize = 50;
    let index = 0;
    const mods = [];

    while (true) {
        const json = await fetchJson(`${CURSEFORGE_BASE_URL}/mods/search`, {
            headers,
            params: {
                gameId,
                authorId,
                pageSize,
                index,
            },
        });

        const data = json?.data ?? [];
        if (!data.length) break;

        mods.push(...data);

        if (data.length < pageSize) break;
        index += pageSize;
    }

    return mods;
}

async function getTotalDownloadsCurseForge(authorId = CURSEFORGE_AUTHOR_ID) {
    const mods = await getCurseForgeResources(authorId);

    let total = 0;
    for (const m of mods) {
        total += Number(m?.downloadCount || 0);
    }

    return total;
}

/* =========================
   MODRINTH (public API)
   ========================= */

async function getModrinthResources(userSlug = MODRINTH_USER) {
    return fetchJson(`${MODRINTH_BASE_URL}/user/${encodeURIComponent(userSlug)}/projects`);
}

async function getTotalDownloadsModrinth(userSlug = MODRINTH_USER) {
    const projects = await getModrinthResources(userSlug);

    let total = 0;
    for (const p of projects) {
        total += Number(p?.downloads || 0);
    }

    return total;
}

/* =========================
   GEODE (scrape HTML)
   ========================= */

function stripTags(html) {
    // Basic tag stripper to turn HTML into plain text.
    // Good enough for regex scanning; not a full HTML parser.
    return html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<\/?[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

async function getTotalDownloadsGeode(modUrl = GEODE_MOD_URL) {
    const html = await fetchText(modUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
    });

    const text = stripTags(html);

    // numbers like 1,234 or 123,456,789
    const commaNumRe = /\b\d{1,3}(?:,\d{3})+\b/g;

    // Prefer comma-numbers near the word download(s)
    const keywordRe = /download[s]?/ig;

    const keywordMatches = [...text.matchAll(keywordRe)];
    if (keywordMatches.length) {
        for (const km of keywordMatches) {
            const i = km.index ?? 0;
            const window = text.slice(Math.max(0, i - 80), Math.min(text.length, i + 80));
            const nums = window.match(commaNumRe);
            if (nums && nums.length) {
                return Number(nums[0].replaceAll(",", ""));
            }
        }
        throw new Error("Found 'download(s)' in Geode page text, but no comma-formatted number near it.");
    }

    // Fallback: pick the largest comma-number on the page
    const nums = text.match(commaNumRe);
    if (!nums || !nums.length) {
        throw new Error("No comma-formatted numbers like 1,234,567 found in Geode page HTML.");
    }

    const largest = nums.reduce((best, cur) => {
        const b = Number(best.replaceAll(",", ""));
        const c = Number(cur.replaceAll(",", ""));
        return c > b ? cur : best;
    }, nums[0]);

    return Number(largest.replaceAll(",", ""));
}

/* =========================
   GRAND TOTAL
   ========================= */

async function getGrandTotalDownloads() {
    const [spigot, curseforge, modrinth, geode] = await Promise.all([
        getTotalDownloadsSpigot(),
        getTotalDownloadsCurseForge(),
        getTotalDownloadsModrinth(),
        getTotalDownloadsGeode(),
    ]);

    return spigot + curseforge + modrinth + geode;
}

/* =========================
   RUN
   ========================= */

(async () => {
    const total = await getGrandTotalDownloads();
    console.log(total);
})().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
