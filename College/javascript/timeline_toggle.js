(() => {
    function initializeTimelineToggle() {
        const section = document.getElementById("timeline");
        const timeline = section?.querySelector(".timeline");
        const header = section?.querySelector(".section-header");

        if (!timeline || !header || document.getElementById("timeline-toggle")) {
            return;
        }

        timeline.id ||= "timeline-content";
        timeline.hidden = true;
        // Ensure existing layout rules cannot override the collapsed state.
        const previousDisplay = timeline.style.display;
        timeline.style.display = "none";

        header.classList.add("visible");
        header.style.width = "100%";

        const button = document.createElement("button");
        button.id = "timeline-toggle";
        button.type = "button";
        button.className = "btn secondary";
        button.setAttribute("aria-controls", timeline.id);
        button.setAttribute("aria-expanded", "false");
        Object.assign(button.style, {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderRadius: "var(--r, 22px)",
            fontSize: "1.25rem",
            fontWeight: "700",
            textAlign: "left"
        });

        const label = document.createElement("span");
        label.textContent = "Timeline";
        const arrow = document.createElement("span");
        arrow.textContent = "▾";
        arrow.setAttribute("aria-hidden", "true");
        button.append(label, arrow);
        header.replaceChildren(button);

        button.addEventListener("click", () => {
            const expand = button.getAttribute("aria-expanded") !== "true";
            button.setAttribute("aria-expanded", String(expand));
            arrow.textContent = expand ? "▴" : "▾";
            timeline.hidden = !expand;
            timeline.style.display = expand ? previousDisplay : "none";

            if (expand) {
                // Hidden elements may not have been revealed by webScript.js.
                timeline.classList.add("visible");
                timeline.querySelectorAll(".fade").forEach(element => {
                    element.classList.add("visible");
                });
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeTimelineToggle);
    } else {
        initializeTimelineToggle();
    }
})();