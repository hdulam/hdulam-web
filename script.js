/*=========================================================
HDULAM
Premium UI Script
=========================================================*/

gsap.registerPlugin(ScrollTrigger);

/*=========================================================
NAVBAR
=========================================================*/

const navbar = document.querySelector(".hd-navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.background = "rgba(5,8,22,.82)";
        navbar.style.backdropFilter = "blur(28px)";
        navbar.style.padding = "12px 0";
        navbar.style.boxShadow = "0 15px 35px rgba(0,0,0,.25)";

    } else {

        navbar.style.background = "rgba(5,8,22,.45)";
        navbar.style.padding = "18px 0";
        navbar.style.boxShadow = "none";

    }

});

/*=========================================================
HERO
=========================================================*/

const heroTimeline = gsap.timeline();

heroTimeline

.from(".hero-tag", {

    y: 40,
    opacity: 0,
    duration: .8

})

.from(".hero h1", {

    y: 70,
    opacity: 0,
    duration: 1

}, "-=.4")

.from(".hero p", {

    y: 40,
    opacity: 0,
    duration: .8

}, "-=.5")

.from(".hero-buttons", {

    y: 40,
    opacity: 0,
    duration: .8

}, "-=.4")

.from(".hero-stats div", {

    y: 30,
    opacity: 0,
    stagger: .15,
    duration: .5

}, "-=.3")

.from(".hero-card", {

    scale: .85,
    opacity: 0,
    duration: 1

}, "-=1")

.from(".floating-card", {

    x: 40,
    opacity: 0,
    stagger: .2

}, "-=.6");

/*=========================================================
SCROLL REVEAL
=========================================================*/

gsap.utils.toArray("section").forEach(section => {

    gsap.from(section, {

        opacity: 0,
        y: 100,

        duration: 1,

        scrollTrigger: {

            trigger: section,

            start: "top 85%"

        }

    });

});

/*=========================================================
BENTO
=========================================================*/

gsap.utils.toArray(".bento").forEach(card => {

    gsap.from(card, {

        opacity: 0,

        y: 80,

        duration: .8,

        scrollTrigger: {

            trigger: card,

            start: "top 85%"

        }

    });

});

/*=========================================================
PROJECTS
=========================================================*/

gsap.utils.toArray(".project-card").forEach(card => {

    gsap.from(card, {

        opacity:0,

        scale:.95,

        duration:.8,

        scrollTrigger:{

            trigger:card,

            start:"top 80%"

        }

    });

});

/*=========================================================
COUNTERS
=========================================================*/

document.querySelectorAll(".stat-box h2").forEach(counter=>{

const value=counter.innerText;

const number=parseInt(value);

if(isNaN(number)) return;

gsap.fromTo(counter,

{

textContent:0

},

{

textContent:number,

duration:2,

ease:"power2.out",

snap:{textContent:1},

scrollTrigger:{

trigger:counter,

start:"top 90%"

},

onUpdate(){

counter.innerHTML=Math.ceil(counter.textContent)+value.replace(number,'');

}

});

});

/*=========================================================
PARALLAX HERO
=========================================================*/

window.addEventListener("mousemove",(e)=>{

const x=(window.innerWidth/2-e.pageX)/40;

const y=(window.innerHeight/2-e.pageY)/40;

gsap.to(".hero-card",{

x,

y,

duration:.8

});

});

/*=========================================================
FLOATING CARDS
=========================================================*/

gsap.to(".card-one",{

y:-20,

repeat:-1,

yoyo:true,

duration:2

});

gsap.to(".card-two",{

y:20,

repeat:-1,

yoyo:true,

duration:3

});

/*=========================================================
GLOW FOLLOW
=========================================================*/

const blur=document.querySelector(".blur-one");

document.addEventListener("mousemove",(e)=>{

gsap.to(blur,{

left:e.clientX-200,

top:e.clientY-200,

duration:2,

ease:"power3.out"

});

});

/*=========================================================
BUTTON HOVER
=========================================================*/

document.querySelectorAll(".btn").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

gsap.to(btn,{

scale:1.04,

duration:.2

});

});

btn.addEventListener("mouseleave",()=>{

gsap.to(btn,{

scale:1,

duration:.2

});

});

});

/*=========================================================
STATS HOVER
=========================================================*/

document.querySelectorAll(".stat-box").forEach(box=>{

box.addEventListener("mouseenter",()=>{

gsap.to(box,{

y:-10,

duration:.3

});

});

box.addEventListener("mouseleave",()=>{

gsap.to(box,{

y:0,

duration:.3

});

});

});

/*=========================================================
TILT EFFECT
=========================================================*/

document.querySelectorAll(".bento,.project-card,.testimonial").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateY=((x/rect.width)-.5)*12;

const rotateX=((y/rect.height)-.5)*-12;

gsap.to(card,{

rotateX,

rotateY,

transformPerspective:1000,

duration:.4

});

});

card.addEventListener("mouseleave",()=>{

gsap.to(card,{

rotateX:0,

rotateY:0,

duration:.5

});

});

});
/*=========================================================
CURSOR GLOW
=========================================================*/

const glow = document.createElement("div");

glow.className = "cursor-glow";

document.body.appendChild(glow);

document.addEventListener("mousemove", (e) => {

    gsap.to(glow, {

        x: e.clientX - 180,

        y: e.clientY - 180,

        duration: .45,

        ease: "power3.out"

    });

});

/*=========================================================
SCROLL PROGRESS BAR
=========================================================*/

const progress = document.createElement("div");

progress.className = "scroll-progress";

document.body.appendChild(progress);

window.addEventListener("scroll", () => {

    const total = document.documentElement.scrollHeight - window.innerHeight;

    const current = window.scrollY;

    const percent = (current / total) * 100;

    progress.style.width = percent + "%";

});

/*=========================================================
MAGNETIC BUTTONS
=========================================================*/

document.querySelectorAll(".btn").forEach(btn => {

    btn.addEventListener("mousemove", (e) => {

        const rect = btn.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        const moveX = (x - rect.width / 2) / 7;

        const moveY = (y - rect.height / 2) / 7;

        gsap.to(btn, {

            x: moveX,

            y: moveY,

            duration: .25

        });

    });

    btn.addEventListener("mouseleave", () => {

        gsap.to(btn, {

            x: 0,

            y: 0,

            duration: .35

        });

    });

});

/*=========================================================
REVEAL TITLES
=========================================================*/

document.querySelectorAll("h2").forEach(title => {

    gsap.from(title, {

        opacity: 0,

        y: 60,

        duration: .9,

        scrollTrigger: {

            trigger: title,

            start: "top 85%"

        }

    });

});

/*=========================================================
PARALLAX BACKGROUND
=========================================================*/

window.addEventListener("scroll", () => {

    const scroll = window.pageYOffset;

    gsap.to(".bg-grid", {

        y: scroll * .12,

        duration: .4

    });

});

/*=========================================================
FLOATING ICONS
=========================================================*/

gsap.utils.toArray(".service-icon").forEach(icon => {

    gsap.to(icon, {

        y: -8,

        duration: 2,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut",

        delay: Math.random()

    });

});

/*=========================================================
FAQ
=========================================================*/

document.querySelectorAll(".accordion-item").forEach(item => {

    item.addEventListener("mouseenter", () => {

        gsap.to(item, {

            scale: 1.02,

            duration: .25

        });

    });

    item.addEventListener("mouseleave", () => {

        gsap.to(item, {

            scale: 1,

            duration: .25

        });

    });

});

/*=========================================================
WHATSAPP
=========================================================*/

gsap.to(".floating-whatsapp", {

    scale: 1.08,

    repeat: -1,

    yoyo: true,

    duration: .9,

    ease: "power1.inOut"

});

/*=========================================================
TEXT PARALLAX
=========================================================*/

gsap.utils.toArray(".section-header").forEach(header => {

    gsap.to(header, {

        y: -35,

        ease: "none",

        scrollTrigger: {

            trigger: header,

            scrub: true

        }

    });

});

/*=========================================================
CARDS STAGGER
=========================================================*/

gsap.utils.toArray(".mini-card").forEach((card, i) => {

    gsap.from(card, {

        opacity: 0,

        y: 70,

        duration: .7,

        delay: i * .1,

        scrollTrigger: {

            trigger: card,

            start: "top 90%"

        }

    });

});

/*=========================================================
LOGOS
=========================================================*/

gsap.from(".trusted-logos span", {

    opacity: 0,

    y: 30,

    stagger: .12,

    duration: .5,

    scrollTrigger: {

        trigger: ".trusted-section",

        start: "top 85%"

    }

});

/*=========================================================
PAGE LOADER
=========================================================*/

window.addEventListener("load", () => {

    gsap.to("body", {

        opacity: 1,

        duration: .5

    });

});

/*=========================================================
CONSOLE
=========================================================*/

console.log(

"%cHDulam Premium",

"color:#7C3AED;font-size:22px;font-weight:bold"

);

console.log(

"%cDiseñado con ❤️",

"color:#06B6D4;font-size:14px"

);