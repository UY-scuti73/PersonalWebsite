// EDIT HERE: Paste your transcript URL between the quotation marks.
const TRANSCRIPT_URL = "";

const groups = [
    { title: "Computer Science & Engineering", id: "computer-science", intro: "Programming, systems, algorithms, and software development, including graduate-level coursework.", featured: true, courses: [
            ["EGN1002", "Fundamentals of Engineering", 3, "FAU", "Spring 2022", "A"],
            ["COP2220", "Programming in C", 3, "FAU", "Fall 2021", "A"],
            ["COP3014", "Foundations of Computer Science", 3, "FAU", "Spring 2022", "A"],
            ["COP3035", "Programming in Python", 3, "FAU", "Spring 2024", "A"],
            ["COT2000", "Discrete Structures", 3, "FAU", "Spring 2023", "A"],
            ["CDA3203", "Logic Design", 3, "FAU", "Spring 2023", "A"],
            ["CDA3101", "Computer Organization", 3, "UF", "Fall 2024", "A-"],
            ["CDA4102", "Computer Architecture", 3, "FAU", "Spring 2024", "A"],
            ["CDA5155", "Advanced Computer Architecture", 3, "UF Grad", "Fall 2025", "A-"],
            ["COP3530", "Data Structures", 3, "FAU", "Fall 2023", "A"],
            ["COP5536", "Advanced Data Structures", 3, "UF Grad", "Fall 2025", "A-"],
            ["COP4600", "Operating Systems", 3, "UF", "Spring 2025", "B"],
            ["CIS4301", "Database Systems", 3, "UF", "Spring 2026", "A"],
            ["COP5725", "Database Management", 3, "UF Grad", "Fall 2026", ""],
            ["COP4533", "Algorithm Design", 3, "UF", "Fall 2025", "B+"],
            ["COT5405", "Analysis of Algorithms", 3, "UF Grad", "Fall 2026", ""],
            ["COP5556", "Programming Languages", 3, "UF Grad", "Spring 2026", "A"],
            ["COP3813", "Internet Computing", 3, "FAU", "Fall 2023", "A"],
            ["CEN3031", "Software Engineering", 3, "UF", "Spring 2025", "A"],
            ["CIS4914", "Senior Project", 3, "UF", "Spring 2026", "A"],
            ["CAP5771", "Intro to Data Science", 3, "UF Grad", "Fall 2026", ""]
        ]},
    { title: "Astronomy", id: "astronomy", intro: "Astronomy coursework with documented projects in observation, image construction, machine learning, and time-domain research.", featured: true, courses: [
            ["AST2002", "Intro to Astronomy", 3, "FAU", "Spring 2022", "A"], ["AST3018", "Astronomy 1", 3, "UF", "Spring 2025", "A"], ["AST3019", "Astronomy 2", 3, "UF", "Spring 2025", "A"], ["AST3722C", "Observational Astronomy", 3, "UF", "Spring 2025", "A-"], ["AST2003", "Solar System Astronomy", 3, "UF", "Fall 2025", "A"], ["AST2730", "Astronomy Programming", 4, "UF", "Spring 2026", "A"], ["AST4930", "Astronomy Machine Learning", 3, "UF", "Fall 2025", "A"], ["AST4930", "Time Domain Astronomy", 3, "UF", "Spring 2026", "A"]
        ]},
    { title: "Mathematics & Statistics", id: "mathematics", intro: "A sequence from precalculus through multivariable calculus, complemented by computational linear algebra and engineering statistics.", courses: [
            ["MAC1147", "Precalc & Trig", 4, "FAU", "Fall 2021", "B+"], ["MAC2311", "Calculus 1", 4, "FAU", "Fall 2022", "A"], ["MAC2312", "Calculus 2", 4, "FAU", "Spring 2023", "A"], ["MAC2313", "Calculus 3", 4, "FAU", "Spring 2024", "A"], ["MAS3114", "Computational Linear Algebra", 3, "UF", "Fall 2024", "A"], ["STA3032", "Engineering Statistics", 3, "UF", "Summer 2025", "B"]
        ]},
    { title: "Physics & Chemistry", id: "science", intro: "Chemistry and physics coursework, with separately listed laboratory credits.", courses: [
            ["CHM2045", "Chemistry 1", 3, "FAU", "Fall 2022", "A"], ["CHM2045L", "Chemistry 1 Lab", 1, "FAU", "Fall 2022", "B-"], ["PHY2048", "Physics 1", 4, "FAU", "Spring 2024", "A"], ["PHY2048L", "Physics 1 Lab", 1, "FAU", "Fall 2023", "B+"], ["PHY2049", "Physics 2", 3, "UF", "Fall 2024", "B+"], ["PHY2049L", "Physics 2 Lab", 1, "UF", "Fall 2024", "A"]
        ]},
    { title: "Language Arts & Communication", id: "language-arts", intro: "Spanish, college writing, fiction, and professional communication.", courses: [
            ["SPN1120", "Spanish 1", 4, "FAUHS", "Fall 2020", "A-"], ["SPN1121", "Spanish 2", 4, "FAUHS", "Spring 2021", "A"], ["ENC1101", "College Writing 1", 3, "FAU", "Fall 2021", "A-"], ["ENC1102", "College Writing 2", 3, "FAU", "Fall 2022", "A-"], ["LIT2010", "Interpretation of Fiction", 3, "FAU", "Summer 2023", "A"], ["ENC3246", "Professional Communications", 3, "UF", "Summer 2025", "A"]
        ]},
    { title: "History & Social Sciences", id: "history", intro: "United States and world history, government, geography, and economics.", courses: [
            ["AMH2010", "US History to 1877", 3, "FAU", "Spring 2023", "B"], ["AMH2020", "US History Since 1877", 3, "FAU", "Fall 2022", "A"], ["POS2041", "US Government", 3, "FAU", "Spring 2023", "A-"], ["WOH2010", "World Civilization", 3, "FAU", "Fall 2023", "A-"], ["GEA2000", "World Geography", 3, "FAU", "Spring 2022", "B-"], ["ECO2023", "Microeconomics", 3, "FAU", "Summer 2023", "A"]
        ]},
    { title: "Arts & Humanities", id: "arts", intro: "Coursework in visual art and music appreciation.", courses: [["ARH2000", "Art Appreciation", 3, "FAU", "Summer 2023", "A"], ["MUL2010", "Music Appreciation", 3, "FAU", "Summer 2023", "A"]]},
    { title: "Society & Environmental Topics", id: "society", intro: "Courses in society, food waste, and wildlife issues.", courses: [["IDS2935", "Designing Society", 3, "UF", "Fall 2024", "A"], ["HOS2333", "Food Waste & Loss", 3, "UF", "Summer 2025", "A"], ["WIS2040", "Wildlife Issues", 3, "UF", "Fall 2024", "A"]]},
    { title: "College Transition & Mentoring", id: "mentoring", intro: "Transition preparation and peer mentoring during my time at FAU.", courses: [["SLS1101", "High School/Uni Transition", 3, "FAU", "Fall 2021", "A"], ["EDF4916", "SAT Prep", 1, "FAU", "Summer 2022", "S"], ["SDS3483", "Peer Mentoring", 2, "FAU", "Fall 2023", "A"]]}
];

const details = {
    "CDA3101|Fall 2024": "I wrote papers on buffer overflows and cache analysis, comparing cache performance across different block sizes and total cache capacities.",
    "CDA5155|Fall 2025": "I built a RISC-V simulator in Python that interpreted 32-bit binaries, disassembled instructions, and simulated execution in standard and pipelined modes.",
    "COP5536|Fall 2025": "I built an airport management simulator in Python, using heaps and priority structures to make flight and runway decisions.",
    "COP4600|Spring 2025": "I implemented a C++ memory manager and used Valgrind to identify and eliminate memory leaks. I also built a WAD file system in C++ and connected it to a Linux interface using wadfs.",
    "CIS4914|Spring 2026": "I led a senior team developing a website to estimate whether an LLM response may be hallucinated. As project manager, I coordinated deadlines and communication and focused on backend NEAR score computation, continuing Dr. Sumit Jha’s research direction.",
    "AST3722C|Spring 2025": "I captured astronomical objects in individual wavelength bands and aligned, scaled, and combined the images into true-color composites using Astropy, NumPy, and Matplotlib. One of my images was framed and displayed in the UF Astronomy building.",
    "AST4930|Fall 2025": "I researched solar features and used machine learning to predict their occurrence within the Sun’s 11-year cycle. I analyzed data and built predictive models with Python libraries including Scikit-learn, Astropy, and SunPy.",
    "AST4930|Spring 2026": "I investigated relationships between supernova peak magnitude, post-peak brightness changes, and the metallicity of the progenitor star and host galaxy. I collaborated with a research team on data analysis.",
    "ENC3246|Summer 2025": "I extended my memory manager project through technical writing: an error report about a memory leak, research into possible solutions, and a mock university proposal explaining how I would implement the fix.",
    "CEN3031|Spring 2025": "I worked on a team to develop a social media platform centered around daily affirmations. Was scrum master and worked with an agile framework."
};

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c])); }
function schoolOf(c) { return c[3].startsWith("FAU") ? "FAU" : "UF"; }
function levelOf(c) { return Number((c[0].match(/\d{4}/) || [0])[0]) >= 5000 ? "Graduate" : "Undergraduate"; }
function badges(c) {
    const school = schoolOf(c), inProgress = !c[5];
    const gradeClass = { "B+": "bplus", "B": "b", "B-": "bminus", "S": "s" }[c[5]] || "";
    return `<span class="pill ${school.toLowerCase()}" title="${escapeHTML(c[3])}">${school}</span><span class="pill ${inProgress ? "progress" : "grade " + gradeClass}">${inProgress ? "In progress" : "Grade " + escapeHTML(c[5])}</span>`;
}
function metadata(c) {
    return `<div class="meta"><span>${escapeHTML(c[0])}</span><span aria-hidden="true">·</span><span>${c[2]} ${c[2] === 1 ? "credit" : "credits"}</span><span aria-hidden="true">·</span><span>${escapeHTML(c[4])}</span><span aria-hidden="true">·</span><span>${levelOf(c)}</span>${c[3] === "UF Grad" ? "" : ""}${c[3] === "FAUHS" ? "<span>· FAU High School</span>" : ""}</div>`;
}
// These are editable examples of typical topics, not verified personal assignments.
const placeholders = {
    EGN1002: "Engineering design, problem-solving, teamwork, and introductory design exercises.",
    COP2220: "C programming with functions, arrays, pointers, memory management, and file input/output.",
    COP3014: "C++ Programming fundamentals, structured problem-solving using basic data structures, debugging, and introductory software design.",
    COP3035: "Python functions, collections, object-oriented programming, file handling, and scripting exercises.",
    COT2000: "Logic, sets, relations, combinatorics, graph theory, and mathematical proofs.",
    CDA3203: "Boolean algebra, logic gates, combinational circuits, and sequential digital systems.",
    CDA4102: "Processor organization, instruction sets, pipelining, memory hierarchies, and performance analysis.",
    COP3530: "Lists, stacks, queues, trees, hash tables, graphs, sorting, and complexity analysis.",
    CIS4301: "Relational database design, SQL queries, normalization, and database implementation exercises.",
    COP5725: "Database indexing, query processing, transactions, concurrency control, and recovery.",
    COP4533: "Algorithm design using divide-and-conquer, greedy methods, dynamic programming, and graph algorithms.",
    COT5405: "Algorithm correctness, asymptotic complexity, recurrence relations, and advanced algorithm analysis.",
    COP5556: "Programming language syntax and semantics, type systems, interpreters, and programming paradigms.",
    COP3813: "Web development with HTML, CSS, JavaScript, responsive interfaces, and client/server concepts.",
    CEN3031: "Requirements analysis, software design, version control, testing, and collaborative development.",
    CAP5771: "Data cleaning, exploratory analysis, visualization, statistical modeling, and introductory machine learning.",
    AST2002: "The solar system, stars, galaxies, cosmology, and observational evidence.",
    AST3018: "Astronomical measurement, radiation, physical models, and orbital mechanics.",
    AST3019: "Galaxies, extreme objects, cosmology, and modern astrophysics.",
    AST2003: "Planetary formation, orbital motion, planetary atmospheres, moons, and small solar-system bodies.",
    AST2730: "Scientific programming for astronomy, numerical calculations, data processing, and plotting."
};

function courseHTML(c, group) {
    const text = details[c[0] + "|" + c[4]];
    if (group.featured || text) {
        const summary = text || placeholders[c[0]] || "Typical reading, problem-solving, and subject-specific exercises; replace with personal course details.";
        return `
            <article class="project-card">
                <div class="course-top">
                    <h3>${escapeHTML(c[1])}</h3>
                    <div class="row-pills">${badges(c)}</div>
                </div>
                ${metadata(c)}
                <span class="label">${text ? "What I did" : "Typical coursework"}</span>
                <p class="description">${escapeHTML(summary)}</p>
            </article>
        `;
    }
    return `
        <article class="course-row">
            <div>
                <h3>${escapeHTML(c[1])}</h3>
                ${metadata(c)}
            </div>
            <div class="row-pills">${badges(c)}</div>
        </article>
    `;
}

const section_dict = {
    "Computer Science & Engineering": "Computer Science",
    "Astronomy": "Astronomy",
    "Mathematics & Statistics": "Math",
    "Physics & Chemistry": "Science",
    "Language Arts & Communication": "Language Arts",
    "History & Social Sciences": "History",
    "Arts & Humanities": "Humanities",
    "Society & Environmental Topics": "Societal Topics",
    "College Transition & Mentoring": "Pedagogy"
};

function render() {
    const q = document.getElementById("search").value.toLowerCase().trim();
    const filter = document.getElementById("school").value;
    let completed = 0;
    let inProgress = 0;

    document.querySelectorAll("[data-school]").forEach(button => {
        const active = button.dataset.school === filter;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("primary", active);
        button.classList.toggle("secondary", !active);
    });

    document.getElementById("course-sections").innerHTML = groups.map(group => {
        const courses = group.courses.filter(c => {
            const matchesSchool = filter === "all" || schoolOf(c) === filter;
            const searchable = [...c, schoolOf(c), group.title, details[c[0] + "|" + c[4]] || "", placeholders[c[0]] || ""].join(" ").toLowerCase();
            return matchesSchool && searchable.includes(q);
        });
        if (!courses.length) return "";
        courses.forEach(c => c[5] ? completed++ : inProgress++);

        // Compact rows first, followed by highlighted cards. ENC3246 is therefore last.
        const rows = courses.filter(c => !group.featured && !details[c[0] + "|" + c[4]]);
        const cards = courses.filter(c => group.featured || details[c[0] + "|" + c[4]]);
        const rowsHTML = rows.length
            ? `<div class="list">${rows.map(c => courseHTML(c, group)).join("\n")}</div>`
            : "";
        const cardsHTML = cards.length
            ? `<div class="projects-grid"${rows.length ? ' style="margin-top:1rem"' : ""}>${cards.map(c => courseHTML(c, group)).join("\n")}</div>`
            : "";

        return `
            <section class="section" id="${group.id}">
                <div class="section-header">
                    <span class="eyebrow">${escapeHTML(section_dict[group.title] ?? group.title)}</span>
                    <h2>${group.title}</h2>
                    <p class="section-intro">${group.intro}</p>
                </div>
                ${rowsHTML}
                ${cardsHTML}
            </section>
        `;
    }).join("\n");

    document.getElementById("count").textContent = `${completed} completed · ${inProgress} in progress`;
    document.getElementById("empty").hidden = completed + inProgress > 0;
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("school").addEventListener("change", render);
document.querySelectorAll("[data-school]").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("school").value = button.dataset.school;
        render();
    });
});

const transcript = document.getElementById("transcript-button");
const transcriptStatus = document.getElementById("transcript-status");

if (transcript) {
    if (TRANSCRIPT_URL) {
        transcript.href = TRANSCRIPT_URL;

        if (transcriptStatus) {
            transcriptStatus.hidden = true;
        }
    } else {
        transcript.setAttribute("aria-disabled", "true");

        transcript.addEventListener("click", event => {
            event.preventDefault();

            if (transcriptStatus) {
                transcriptStatus.textContent =
                    "The transcript link has not been added yet.";
            }
        });
    }
}

render();