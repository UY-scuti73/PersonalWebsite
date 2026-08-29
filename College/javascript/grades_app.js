(() => {
    'use strict';

    // ---- config ----
    const CONFIG = {
        csvUrl: './documents/grades.csv',
        defaultSort: { key: 'index', dir: 'asc' },
        excludedFromGpa: new Set(['S', 'U', 'W', 'N/A']),
    };

    const gpaPoints = {
        'A': 4,
        'A-': 3.67,
        'B+': 3.33,
        'B': 3,
        'B-': 2.67,
        'C+': 2.33,
        'C': 2,
        'C-': 1.67,
        'D+': 1.33,
        'D': 1,
        'D-': 0.67,
        'F': 0,
    };

    const ORDER = {
        place_taken: ['FAU', 'UF', 'UF Grad'],
        completed: ['Yes', 'Withdrew', 'In Progress', 'No'],
        semester: [
            'Fall 2020', 'Spring 2021',
            'Fall 2021', 'Spring 2022', 'Summer 2022', 'Fall 2022', 'Spring 2023', 'Summer 2023',
            'Fall 2023', 'Spring 2024', 'Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025',
            'Spring 2026', 'Fall 2026', 'Spring 2027', 'Summer 2027'
        ],
        grade: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'S', 'U', 'W', 'N/A'],
        exactGrades: ['A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F','S','U','W','N/A'],
    };

    // ---- state ----
    let allRows = []; // canonical rows
    let sortState = { ...CONFIG.defaultSort };

    // ---- DOM helpers ----
    const byId = (id) => document.getElementById(id);

    const setText = (id, v) => {
        const el = byId(id);
        if (!el) return;
        el.textContent = (v === null || v === undefined || Number.isNaN(v)) ? '—' : String(v);
    };

    const safeGradeClass = (grade) => String(grade || '')
        .trim()
        .replace('+', 'PLUS')
        .replace('-', '-')
        .toUpperCase();

    // ---- CSV parsing (handles quoted fields + commas) ----
    function parseCsv(text) {
        const rows = [];
        let i = 0;
        let field = '';
        let record = [];
        let inQuotes = false;

        const pushField = () => {
            record.push(field);
            field = '';
        };

        const pushRecord = () => {
            // ignore a final empty record from trailing newline
            if (record.length === 1 && record[0] === '') {
                record = [];
                return;
            }
            rows.push(record);
            record = [];
        };

        while (i < text.length) {
            const c = text[i];

            if (inQuotes) {
                if (c === '"') {
                    // escaped quote
                    if (text[i + 1] === '"') {
                        field += '"';
                        i += 2;
                        continue;
                    }
                    inQuotes = false;
                    i += 1;
                    continue;
                }
                field += c;
                i += 1;
                continue;
            }

            if (c === '"') {
                inQuotes = true;
                i += 1;
                continue;
            }

            if (c === ',') {
                pushField();
                i += 1;
                continue;
            }

            if (c === '\n') {
                pushField();
                pushRecord();
                i += 1;
                continue;
            }

            if (c === '\r') {
                // handle CRLF
                i += 1;
                continue;
            }

            field += c;
            i += 1;
        }

        // last field/record
        pushField();
        pushRecord();

        return rows;
    }

    function csvToObjects(csvText) {
        const grid = parseCsv(csvText);
        if (!grid.length) return [];

        const header = grid[0].map(h => String(h).trim().replace(/^\uFEFF/, '')); // remove BOM if present
        const canon = (s) => String(s).trim().toLowerCase().replace(/[\s\-]+/g, '_');
        const headerCanon = header.map(canon);

        const out = [];

        for (let r = 1; r < grid.length; r++) {
            const rec = grid[r];
            if (!rec || rec.every(v => String(v).trim() === '')) continue;
            const obj = {};
            for (let c = 0; c < header.length; c++) {
                obj[headerCanon[c]] = rec[c] ?? '';
            }
            out.push(obj);
        }

        return out;
    }

    function normalizeRows(rows) {
        // Ensure types + required keys
        return rows.map((r, idx) => {
            const index = Number(r.index ?? r.Index ?? r['#'] ?? (idx + 1));
            const credits = Number(r.credits ?? r.Credits ?? 0);
            return {
                index: Number.isFinite(index) ? index : (idx + 1),
                course_code: String(r.course_code ?? r.CourseCode ?? r['course code'] ?? ''),
                course_name: String(r.course_name ?? r.CourseName ?? r['course name'] ?? ''),
                credits: Number.isFinite(credits) ? credits : 0,
                place_taken: String(r.place_taken ?? r.PlaceTaken ?? r['place taken'] ?? ''),
                completed: String(r.completed ?? r.Completed ?? ''),
                semester: String(r.semester ?? r.Semester ?? ''),
                grade: String(r.grade ?? r.Grade ?? ''),
            };
        });
    }

    // ---- computations ----
    function computeGpa(rows) {
        let qualityPoints = 0;
        let totalCredits = 0;

        for (const r of rows) {
            const grade = r.grade;
            const credits = Number(r.credits) || 0;
            if (!credits) continue;
            if (CONFIG.excludedFromGpa.has(grade)) continue;
            const pts = (grade in gpaPoints) ? gpaPoints[grade] : 0;
            qualityPoints += credits * pts;
            totalCredits += credits;
        }

        if (totalCredits <= 0) return 0;
        return qualityPoints / totalCredits;
    }

    function formatGpa(value, rounding) {
        const n = Number(value);
        if (!Number.isFinite(n)) return '—';
        return n.toFixed(rounding);
    }

    function handleGpa(rows, rounding = 2) {
        const total = computeGpa(rows);
        const fau = computeGpa(rows.filter(r => r.place_taken === 'FAU'));
        const uf = computeGpa(rows.filter(r => r.place_taken === 'UF' || r.place_taken === 'UF Grad'));
        const ug = computeGpa(rows.filter(r => r.place_taken === 'FAU' || r.place_taken === 'UF'));
        const grad = computeGpa(rows.filter(r => r.place_taken === 'UF Grad'));

        return {
            total_gpa: formatGpa(total, rounding),
            fau_gpa: formatGpa(fau, rounding),
            uf_gpa: formatGpa(uf, rounding),
            undergrad_gpa: formatGpa(ug, rounding),
            grad_gpa: formatGpa(grad, rounding),
        };
    }

    function handleCourses(rows) {
        const total_courses = rows.length;
        const total_credits = rows.reduce((acc, r) => acc + (Number(r.credits) || 0), 0);
        return {
            total_courses,
            total_credits,
        };
    }

    function countGrades(rows) {
        const exact = {};
        for (const g of ORDER.exactGrades) exact[g] = 0;

        for (const r of rows) {
            const g = r.grade;
            if (g in exact) exact[g] += 1;
        }

        const grouped = {
            A: (exact['A'] || 0) + (exact['A-'] || 0),
            B: (exact['B+'] || 0) + (exact['B'] || 0) + (exact['B-'] || 0),
            C: (exact['C+'] || 0) + (exact['C'] || 0) + (exact['C-'] || 0),
        };

        return { exact, grouped };
    }

    // ---- sorting ----
    function compareValues(a, b, key) {
        const av = a?.[key];
        const bv = b?.[key];

        if (key === 'index' || key === 'credits') {
            return (Number(av) || 0) - (Number(bv) || 0);
        }

        // custom categorical order
        if (key in ORDER) {
            const order = ORDER[key];
            const ai = order.indexOf(String(av));
            const bi = order.indexOf(String(bv));
            const ax = ai === -1 ? Number.POSITIVE_INFINITY : ai;
            const bx = bi === -1 ? Number.POSITIVE_INFINITY : bi;
            if (ax !== bx) return ax - bx;
            // tie-breaker for stable-ish sorting
            return (Number(a.index) || 0) - (Number(b.index) || 0);
        }

        return String(av ?? '').localeCompare(String(bv ?? ''), undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    }

    function getSortedRows(rows) {
        const sorted = [...rows].sort((a, b) => compareValues(a, b, sortState.key));
        if (sortState.dir === 'desc') sorted.reverse();
        return sorted;
    }

    function setSortIndicators() {
        const ths = document.querySelectorAll('.grades-table thead th[data-key]');
        ths.forEach(th => {
            th.classList.remove('is-sorted-asc', 'is-sorted-desc');
            if (th.dataset.key === sortState.key) {
                th.classList.add(sortState.dir === 'asc' ? 'is-sorted-asc' : 'is-sorted-desc');
            }
        });
    }

    // ---- rendering ----
    function renderTable(rows) {
        const tbody = byId('gradesTbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const frag = document.createDocumentFragment();

        for (const r of rows) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td class="is-num">${r.index ?? ''}</td>
        <td>${r.course_code ?? ''}</td>
        <td>${r.course_name ?? ''}</td>
        <td class="is-num">${r.credits ?? ''}</td>
        <td>${r.place_taken ?? ''}</td>
        <td>${r.completed ?? ''}</td>
        <td>${r.semester ?? ''}</td>
        <td><span class="grade-pill grade-${safeGradeClass(r.grade)}">${r.grade ?? ''}</span></td>
      `;
            frag.appendChild(tr);
        }

        tbody.appendChild(frag);
    }

    function renderSummary(rows) {
        const s = handleCourses(rows);
        setText('statTotalCourses', s.total_courses);
        setText('statTotalCredits', Number.isFinite(s.total_credits) ? s.total_credits : '—');
    }

    function getRoundingValue() {
        // Supports either #gpaRounding or .gpa-rounding
        const input = byId('gpaRounding') || document.querySelector('input.gpa-rounding');
        if (!input) return 2;
        const n = Number(input.value);
        return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 2;
    }

    function renderGpa(rows) {
        const rounding = getRoundingValue();
        const g = handleGpa(rows, rounding);
        setText('gpaTotal', g.total_gpa);
        setText('gpaFAU', g.fau_gpa);
        setText('gpaUF', g.uf_gpa);
        setText('gpaUG', g.undergrad_gpa);
        setText('gpaGrad', g.grad_gpa);
    }

    function renderGradeDistribution(rows) {
        const dist = countGrades(rows);

        // grouped
        setText('countAAll', dist.grouped.A);
        setText('countBAll', dist.grouped.B);
        setText('countCAll', dist.grouped.C);

        // exact
        const m = {
            'A': 'countA',
            'A-': 'countAMinus',
            'B+': 'countBPlus',
            'B': 'countB',
            'B-': 'countBMinus',
            'C+': 'countCPlus',
            'C': 'countC',
            'C-': 'countCMinus',
            'D+': 'countDPlus',
            'D': 'countD',
            'D-': 'countDMinus',
            'F': 'countF',
            'S': 'countS',
            'U': 'countU',
            'W': 'countW',
            'N/A': 'countNA',
        };

        for (const [grade, id] of Object.entries(m)) {
            setText(id, dist.exact[grade] ?? 0);
        }
    }

    function renderAll() {
        const sorted = getSortedRows(allRows);
        renderTable(sorted);
        renderSummary(allRows);
        renderGpa(allRows);
        renderGradeDistribution(allRows);
        setSortIndicators();
    }

    // ---- wiring ----
    function wireSorting() {
        document.querySelectorAll('.grades-table thead th[data-key]').forEach(th => {
            th.addEventListener('click', () => {
                const key = th.dataset.key;
                if (!key) return;

                if (sortState.key === key) {
                    sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
                } else {
                    sortState.key = key;
                    sortState.dir = 'asc';
                }
                renderAll();
            });
        });
    }

    function wireGpaRounding() {
        const input = byId('gpaRounding') || document.querySelector('input.gpa-rounding');
        if (!input) return;

        // Ensure default value 2 if empty
        if (String(input.value || '').trim() === '') input.value = '2';

        const handler = () => {
            // Re-render only GPA with the new rounding
            renderGpa(allRows);
        };

        input.addEventListener('input', handler);
        input.addEventListener('change', handler);
    }

    // ---- load ----
    async function init() {
        wireSorting();
        wireGpaRounding();

        const res = await fetch(CONFIG.csvUrl, { headers: { 'Accept': 'text/csv,*/*' } });
        if (!res.ok) throw new Error(`Failed to load CSV: ${CONFIG.csvUrl} (${res.status})`);

        const csvText = await res.text();
        const objects = csvToObjects(csvText);
        allRows = normalizeRows(objects);

        renderAll();
    }

    // Kick off (defer script recommended)
    init().catch(err => {
        console.error(err);
    });
})();
