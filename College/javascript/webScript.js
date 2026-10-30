(() => {
    function initializePageEffects() {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.documentElement.style.scrollBehavior = reducedMotion ? "auto" : "smooth";

        const observed = new WeakSet();
        const observer = "IntersectionObserver" in window
            ? new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 })
            : null;

        function observeFadeElements() {
            // Course content is created and replaced by courses.js.
            document.querySelectorAll("#course-sections .section-header, #course-sections .project-card, #course-sections .list")
                .forEach(element => element.classList.add("fade"));

            document.querySelectorAll(".fade").forEach(element => {
                if (observed.has(element)) return;
                observed.add(element);
                if (observer && !reducedMotion) observer.observe(element);
                else element.classList.add("visible");
            });
        }

        function getSectionLinks() {
            // Home links such as index.html are not valid CSS selectors.
            return [...document.querySelectorAll(".nav a")].filter(link => {
                const href = link.getAttribute("href") || "";
                return href.startsWith("#") && href.length > 1;
            });
        }

        function setActive() {
            let current = "";
            const links = getSectionLinks();
            links.forEach(link => {
                const section = document.getElementById(link.getAttribute("href").slice(1));
                if (!section) return;
                const rect = section.getBoundingClientRect();
                if (rect.top <= 140 && rect.bottom >= 140) current = section.id;
            });
            links.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === "#" + current);
            });
        }

        let framePending = false;
        window.addEventListener("scroll", () => {
            if (framePending) return;
            framePending = true;
            requestAnimationFrame(() => {
                setActive();
                framePending = false;
            });
        }, { passive: true });
        window.addEventListener("resize", setActive);
        window.addEventListener("load", setActive);

        const courseContainer = document.getElementById("course-sections");
        if (courseContainer) {
            new MutationObserver(() => {
                observeFadeElements();
                setActive();
            }).observe(courseContainer, { childList: true, subtree: true });
        }

        observeFadeElements();
        setActive();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializePageEffects);
    } else {
        initializePageEffects();
    }
})();