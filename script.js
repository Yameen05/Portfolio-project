// ===== MODERN PORTFOLIO JAVASCRIPT =====

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ===== GLOBAL VARIABLES =====
let heroScene, heroCamera, heroRenderer;
let particles = [];

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", function () {
  initializePortfolio();
});

// ===== MAIN INITIALIZATION =====
function initializePortfolio() {
  initScrollProgress();
  initNavigation();
  initMobileMenu();
  initThemeToggle();
  initHeroBackground();
  initTypewriter();
  initScrollAnimations();
  initSkillBars();
  initCertificateAnimations();
  initContactForm();
  initParallaxEffects();
  initSmoothScrolling();
  initFloatingElements();
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  const progressBar = document.querySelector(".scroll-progress");

  window.addEventListener("scroll", () => {
    const scrolled =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    progressBar.style.width = scrolled + "%";
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  let lastScrollY = window.scrollY;

  // Hide/show navbar on scroll
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        gsap.to(navbar, { y: -100, duration: 0.3 });
      } else {
        // Scrolling up
        gsap.to(navbar, { y: 0, duration: 0.3 });
      }
    } else {
      gsap.to(navbar, { y: 0, duration: 0.3 });
    }

    lastScrollY = currentScrollY;
  });

  // Active section highlighting
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileClose = document.getElementById("mobile-close");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openMobileMenu() {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";

  
    // Animate menu items
    gsap.fromTo(
      ".mobile-nav-link",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2 }
    );
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }

  mobileToggle.addEventListener("click", openMobileMenu);
  mobileClose.addEventListener("click", closeMobileMenu);

  // Close menu when clicking on links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu when clicking outside
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  // Check for saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);

    // Animate theme change
    gsap.to(themeToggle, { rotation: 360, duration: 0.5 });
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    
    // Update particle colors for better visibility in current theme
    if (window.updateParticleColors) {
      window.updateParticleColors(theme);
    }
  }
}

// ===== HERO BACKGROUND =====
function initHeroBackground() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  // Three.js setup
  heroScene = new THREE.Scene();
  heroCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  heroRenderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  heroRenderer.setSize(window.innerWidth, window.innerHeight);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particles
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;

    // Create more visible particles with better contrast
    const brightness = 0.3 + Math.random() * 0.7; // More contrast
    colors[i] = brightness;     // Red channel
    colors[i + 1] = brightness; // Green channel  
    colors[i + 2] = brightness; // Blue channel (white particles)
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08, // Larger particles
    vertexColors: true,
    transparent: true,
    opacity: 0.9, // Higher opacity
  });

  const particleSystem = new THREE.Points(geometry, material);
  heroScene.add(particleSystem);

  heroCamera.position.z = 5;

  // Function to update particle colors based on theme
  function updateParticleColors(theme) {
    const colors = geometry.attributes.color.array;
    
    for (let i = 0; i < colors.length; i += 3) {
      if (theme === 'light') {
        // Dark particles for light theme (better contrast)
        const brightness = 0.1 + Math.random() * 0.3;
        colors[i] = brightness;     // Red
        colors[i + 1] = brightness; // Green
        colors[i + 2] = brightness; // Blue
      } else {
        // Light particles for dark theme
        const brightness = 0.6 + Math.random() * 0.4;
        colors[i] = brightness;     // Red
        colors[i + 1] = brightness; // Green
        colors[i + 2] = brightness; // Blue
      }
    }
    
    geometry.attributes.color.needsUpdate = true;
  }

  // Make function globally accessible for theme toggle
  window.updateParticleColors = updateParticleColors;
  
  // Set initial colors based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateParticleColors(currentTheme);

  // Animation loop
  function animateHero() {
    requestAnimationFrame(animateHero);

    particleSystem.rotation.x += 0.001;
    particleSystem.rotation.y += 0.002;

    heroRenderer.render(heroScene, heroCamera);
  }
  animateHero();

  // Handle resize
  window.addEventListener("resize", () => {
    heroCamera.aspect = window.innerWidth / window.innerHeight;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
  const dynamicTitle = document.getElementById("dynamic-title");
  if (!dynamicTitle) return;

  const phrases = [
    "digital experiences",
    "web applications",
    "innovative solutions",
    "user interfaces",
    "scalable systems",
  ];

  let currentPhrase = 0;
  let currentChar = 0;
  let isDeleting = false;

  function typeWriter() {
    const current = phrases[currentPhrase];

    if (isDeleting) {
      dynamicTitle.textContent = current.substring(0, currentChar - 1);
      currentChar--;

      if (currentChar === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
        setTimeout(typeWriter, 500);
        return;
      }
    } else {
      dynamicTitle.textContent = current.substring(0, currentChar + 1);
      currentChar++;

      if (currentChar === current.length) {
        isDeleting = true;
        setTimeout(typeWriter, 2000);
        return;
      }
    }

    setTimeout(typeWriter, isDeleting ? 50 : 100);
  }

  typeWriter();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  // Hero animations
  gsap.fromTo(
    ".hero-greeting",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.2 }
  );

  gsap.fromTo(
    ".hero-name .name-part",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.4 }
  );

  gsap.fromTo(
    ".hero-title",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.8 }
  );

  gsap.fromTo(
    ".hero-description",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 1 }
  );

  gsap.fromTo(
    ".hero-actions .btn",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 1.2 }
  );

  gsap.fromTo(
    ".hero-social .social-link",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 1.4 }
  );

  // Hero image animations
  gsap.fromTo(
    ".hero-image-container",
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 1.5, delay: 0.6 }
  );

  gsap.fromTo(
    ".floating-element",
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, duration: 1, stagger: 0.2, delay: 1.8 }
  );

  // Section animations
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.fromTo(
      header.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // About section animations
  gsap.fromTo(
    ".about-text > *",
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".about-content",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  gsap.fromTo(
    ".about-visual > *",
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".about-content",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Experience timeline animations
  gsap.utils.toArray(".experience-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Project cards animations
  gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Contact section animations
  gsap.fromTo(
    ".contact-method",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".contact-content",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Stats counter animation
  gsap.utils.toArray(".stat-number").forEach((stat) => {
    const finalValue = parseInt(stat.textContent);

    ScrollTrigger.create({
      trigger: stat,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          stat,
          { textContent: 0 },
          {
            textContent: finalValue,
            duration: 2,
            snap: { textContent: 1 },
            onUpdate: function () {
              stat.textContent = Math.ceil(this.targets()[0].textContent) + "+";
            },
          }
        );
      },
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  // Add contact form functionality if needed
  const contactMethods = document.querySelectorAll(".contact-method");

  contactMethods.forEach((method) => {
    method.addEventListener("mouseenter", () => {
      gsap.to(method, { scale: 1.05, duration: 0.3 });
    });

    method.addEventListener("mouseleave", () => {
      gsap.to(method, { scale: 1, duration: 0.3 });
    });
  });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
  // Floating elements parallax
  gsap.utils.toArray(".floating-element").forEach((element, index) => {
    gsap.to(element, {
      y: -50,
      rotation: 360,
      duration: 3 + index,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  // Hero background parallax
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroBackground = document.querySelector(".hero-background");

    if (heroBackground) {
      gsap.to(heroBackground, {
        y: scrolled * 0.5,
        duration: 0.1,
      });
    }
  });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      console.log('Clicking link to:', targetId);
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      console.log('Target element found:', targetElement);

      if (targetElement) {
        // Calculate the position with offset for fixed navbar
        const offsetTop = targetElement.offsetTop - 80;
        console.log('Scrolling to position:', offsetTop);
        
        // Use native smooth scrolling
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        console.error('Target element not found for:', targetId);
      }
    });
  });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Intersection Observer for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(".project-card, .experience-item, .tech-item")
  .forEach((el) => {
    observer.observe(el);
  });

// ===== RESIZE HANDLER =====
window.addEventListener(
  "resize",
  debounce(() => {
    // Update Three.js renderer if it exists
    if (heroRenderer && heroCamera) {
      heroCamera.aspect = window.innerWidth / window.innerHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }, 250)
);

// ===== LOADING ANIMATION =====
window.addEventListener("load", () => {
  // Hide loading screen if exists
  const loader = document.querySelector(".loader");
  if (loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => loader.remove(),
    });
  }

  // Start hero animations
  gsap.to(".hero", { opacity: 1, duration: 1 });
});

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("Portfolio Error:", e.error);
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu
  if (e.key === "Escape") {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

// Reduce motion for users who prefer it
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.globalTimeline.timeScale(0.5);
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializePortfolio,
    initCustomCursor,
    initScrollProgress,
    initNavigation,
  };
}

// ===== FLOATING ELEMENTS INTERACTIVITY =====
function initFloatingElements() {
  const floatingElements = document.querySelectorAll('.floating-element');
  
  floatingElements.forEach((element, index) => {
    // Add click event for fun interaction
    element.addEventListener('click', function() {
      // Create a ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.width = '100%';
      ripple.style.height = '100%';
      ripple.style.borderRadius = 'var(--radius-lg)';
      ripple.style.background = 'rgba(99, 102, 241, 0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.transition = 'transform 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      element.appendChild(ripple);
      
      // Trigger ripple animation
      setTimeout(() => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
      }, 10);
      
      // Remove ripple after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
      
      // Add a bounce effect
      gsap.to(element, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    });
    
    
    
    // Add staggered entrance animation
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        scale: 0.5,
        rotation: Math.random() * 360
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "back.out(1.7)"
      }
    );
  });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  console.log("Found skill bars:", skillBars.length);

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target;
          const targetWidth = skillBar.getAttribute("data-width");
          console.log("Animating skill bar to:", targetWidth);

          gsap.to(skillBar, {
            width: targetWidth,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.2,
          });

          skillObserver.unobserve(skillBar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });
}

// ===== CERTIFICATES ANIMATIONS =====
function initCertificateAnimations() {
  gsap.utils.toArray(".certificate-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 50, rotationY: -15 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 1,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Learning stats counter animation
  gsap.utils.toArray(".stat-number").forEach((stat) => {
    const finalValue = parseInt(stat.textContent);

    ScrollTrigger.create({
      trigger: stat,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          stat,
          { textContent: 0 },
          {
            textContent: finalValue,
            duration: 2,
            snap: { textContent: 1 },
            onUpdate: function () {
              const current = Math.ceil(this.targets()[0].textContent);
              stat.textContent =
                current + (stat.textContent.includes("%") ? "%" : "+");
            },
          }
        );
      },
    });
  });
}
