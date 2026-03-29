const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");
let mouseX = 0,
  mouseY = 0,
  followerX = 0,
  followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + "px";
  follower.style.top = followerY + "px";
  requestAnimationFrame(animateFollower);
})();

document
  .querySelectorAll("a, button, .btn, .skill-pill, .project-card")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "18px";
      cursor.style.height = "18px";
      cursor.style.background = "#ff6b6b";
      follower.style.width = "50px";
      follower.style.height = "50px";
      follower.style.borderColor = "#ff6b6b";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "10px";
      cursor.style.height = "10px";
      cursor.style.background = "var(--primary)";
      follower.style.width = "32px";
      follower.style.height = "32px";
      follower.style.borderColor = "var(--primary)";
    });
  });

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color =
      Math.random() > 0.7
        ? `rgba(0, 255, 136, ${this.alpha})`
        : `rgba(0, 212, 255, ${this.alpha})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
  updateActiveNav();
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach((l) => {
    l.classList.remove("active");
    if (l.getAttribute("href") === "#" + current) l.classList.add("active");
  });
}

const hamburger = document.getElementById("hamburger");
const navLinksMenu = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinksMenu.classList.toggle("open");
});
navLinksMenu.querySelectorAll(".nav-link").forEach((l) => {
  l.addEventListener("click", () => navLinksMenu.classList.remove("open"));
});

const roles = [
  "MERN Stack Developer",
  "React.js Enthusiast",
  "Node.js Builder",
  "MySQL & MongoDB Dev",
  "Problem Solver",
];
let ri = 0,
  ci = 0,
  deleting = false;
const typedEl = document.getElementById("typed-text");

function type() {
  const current = roles[ri];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ci + 1);
    ci++;
    if (ci === current.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        // Skill bars
        entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => observer.observe(el));

const counters = document.querySelectorAll(".stat-number");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const isDecimal = el.dataset.decimal === "true";
        let start = 0;
        const duration = 1500;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = isDecimal ? target.toFixed(1) : target;
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);
counters.forEach((c) => counterObserver.observe(c));

const tiltCard = document.getElementById("tilt-card");
if (tiltCard) {
  tiltCard.addEventListener("mousemove", (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotY = (x / rect.width) * 20;
    const rotX = (-y / rect.height) * 20;
    tiltCard.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(20px)`;
  });
  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "rotateY(0) rotateX(0) translateZ(0)";
  });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rX = (-y / rect.height) * 8;
    const rY = (x / rect.width) * 8;
    card.style.transform = `translateY(-8px) rotateX(${rX}deg) rotateY(${rY}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
  });
});

function handleFormSubmit() {
  const name = document.getElementById("f-name").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const msg = document.getElementById("f-msg").value.trim();

  if (!name || !email || !msg) {
    alert("Please fill all fields!");
    return;
  }

  const btn = document.getElementById("send-btn");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    document.getElementById("form-success").style.display = "block";
    document.getElementById("f-name").value = "";
    document.getElementById("f-email").value = "";
    document.getElementById("f-msg").value = "";

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      document.getElementById("form-success").style.display = "none";
    }, 4000);
  }, 1500);
}

window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.6s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
