const io = new IntersectionObserver((entries)=>{
    for (const e of entries) if (e.isIntersecting) e.target.classList.add('visible')
},{threshold:0.12})
document.querySelectorAll('.fade').forEach(el=>io.observe(el))

const navLinks = document.querySelectorAll('.nav a')
const sections = [...navLinks].map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean)

function setActive(){
    let current = ''
    for (const s of sections){
        const r = s.getBoundingClientRect()
        if (r.top <= 140 && r.bottom >= 140) current = s.id
    }
    navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#' + current))
}

window.addEventListener('scroll', setActive)
window.addEventListener('load', setActive)