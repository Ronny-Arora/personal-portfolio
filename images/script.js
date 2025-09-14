document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll with fixed-navbar offset
  const nav = document.querySelector(".navbar");
  const getNavH = () => (nav ? nav.getBoundingClientRect().height : 0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length === 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        (getNavH() + 12);
      window.history.pushState(null, "", id);
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Active nav highlight on scroll
  const links = [...document.querySelectorAll(".navbar .nav-link")];
  const linkMap = new Map(links.map((l) => [l.getAttribute("href"), l]));
  const sections = [...document.querySelectorAll("section[id]")];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = "#" + entry.target.id;
        const link = linkMap.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: `-${getNavH() + 20}px 0px -70% 0px`, threshold: 0.1 }
  );
  sections.forEach((s) => io.observe(s));

  // Counter animation function
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const inc = target / (duration / 16);
    (function step() {
      start += inc;
      if (start < target) {
        el.textContent = Math.floor(start);
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    })();
  }

  // Intersection Observer for fade-in animations and counters
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");

        // Animate stat counters
        if (entry.target.classList.contains("stat-number")) {
          const t = parseInt(entry.target.getAttribute("data-target"), 10);
          animateCounter(entry.target, t);
        }

        // Animate skill bars
        // Inside your existing observer where you add 'visible'
        if (entry.target.classList.contains('skills-section')) {
        entry.target.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.dataset.width || '0%';
        });
        }

      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  // Observe elements for animations
  document
    .querySelectorAll(".fade-in, .stat-number, .skills-section")
    .forEach((el) => obs.observe(el));

  // Portfolio filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".portfolio-item");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      items.forEach((it) => {
        it.style.display =
          f === "all" || it.classList.contains(f) ? "" : "none";
      });
    });
  });

  // Typed.js for specialties
  if (document.querySelector("#specialty-text")) {
    setTimeout(() => {
      new Typed("#specialty-text", {
        strings: [
          "Full-Stack Development 💻",
          "Machine Learning 🤖",
          "Mobile Apps 📱",
          "Cloud & DevOps ☁️",
          "Data Structures & Algorithms 📊",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 2000,
        showCursor: true,
      });
    }, 1200);
  }

  // Matrix rain effect
  const canvas = document.getElementById("matrix-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    
    function sizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(10,10,15,0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(102,126,234,0.7)";
      ctx.font = fontSize + "px monospace";
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // Custom cursor
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');

  if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Smooth following for cursor follower
    function animateFollower() {
      const distX = mouseX - followerX;
      const distY = mouseY - followerY;
      
      followerX += distX * 0.1;
      followerY += distY * 0.1;
      
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .magnetic-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursorFollower.style.opacity = '0.5';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursorFollower.style.opacity = '1';
      });
    });
  }

  // Magnetic button effect
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // Button ripple effect
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-primary-custom');
    if (!button) return;

    const ripple = button.querySelector('.btn-ripple');
    if (!ripple) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('animate');

    setTimeout(() => {
      ripple.classList.remove('animate');
    }, 600);
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');
      
      // Simple form validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
      alert('Thank you for your message! I\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
      navbar.style.backdropFilter = 'blur(20px)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.1)';
      navbar.style.backdropFilter = 'blur(20px)';
    }
  });

  // Handle page load with hash
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      setTimeout(() => {
        const top =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          (getNavH() + 12);
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    }
  }

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Performance optimization: Pause animations when not visible
  const handleVisibilityChange = () => {
    const isHidden = document.hidden;
    const animations = document.querySelectorAll('.particle, .floating-card, .skill-bubble');
    
    animations.forEach(el => {
      if (isHidden) {
        el.style.animationPlayState = 'paused';
      } else {
        el.style.animationPlayState = 'running';
      }
    });
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Mobile menu handling
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      });
    });
  }

  // Add smooth reveal animations with stagger
  const revealElements = document.querySelectorAll('.reveal-text');
  revealElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
  });

  // Initialize tooltips for social links
  const socialLinks = document.querySelectorAll('[data-tooltip]');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = link.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      link.appendChild(tooltip);
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });
    });
    
    link.addEventListener('mouseleave', () => {
      const tooltip = link.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
});