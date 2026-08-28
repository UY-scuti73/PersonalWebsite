(async () => {
    const res = await fetch("https://moddownloads.onrender.com/stats.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    document.getElementById("total-download-count").textContent = format_string(data.Total);
})().catch(console.error);

function format_string(num) {
    let tempStr = String(num ?? 0);
    return tempStr.slice(0, -3) + "," + tempStr.slice(-3);
}