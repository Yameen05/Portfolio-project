document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#8000ff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#8000ff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });
    
    // Mobile Menu Functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    
    // Toggle mobile menu
    hamburgerMenu.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu
    mobileCloseBtn.addEventListener('click', function() {
        hamburgerMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close mobile menu when clicking on overlay
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on navigation links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Typewriter Effect
    const words = [
        "Computer Science Student",
        "Software Engineer",
        "Front-End Developer",
        "Full-Stack Developer"
    ];
    let i = 0;
    let isDeleting = false;
    let text = "";

    function typeWriter() {
        const currentWord = words[i];
        if (!isDeleting) {
            text = currentWord.substring(0, text.length + 1);
            document.getElementById('typewriter').textContent = text;
            if (text === currentWord) {
                setTimeout(() => { isDeleting = true; typeWriter(); }, 1200);
            } else {
                setTimeout(typeWriter, 85);
            }
        } else {
            text = currentWord.substring(0, text.length - 1);
            document.getElementById('typewriter').textContent = text;
            if (text === "") {
                isDeleting = false;
                i = (i + 1) % words.length;
                setTimeout(typeWriter, 500);
            } else {
                setTimeout(typeWriter, 40);
            }
        }
    }

    // Start the typewriter effect
    typeWriter();
    
    // Smooth scrolling for navigation links (both desktop and mobile)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar hide/show on scroll (only for desktop)
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50; // Minimum scroll amount before hiding navbar

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only trigger on desktop devices (when mobile menu is not active)
        if (window.innerWidth > 768 && !mobileMenuOverlay.classList.contains('active')) {
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                // Scrolling down
                navbar.classList.add('nav-hidden');
                navbar.classList.remove('nav-visible');
            } else {
                // Scrolling up
                navbar.classList.remove('nav-hidden');
                navbar.classList.add('nav-visible');
            }
        } else {
            // On mobile or when menu is open, always show navbar
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Dark mode toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Animate project cards on scroll
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        projectObserver.observe(card);
    });
    
    window.addEventListener('DOMContentLoaded', () => {
        const popup = document.getElementById('theme-popup');
        const closeBtn = document.querySelector('.close-btn');
        
        if (popup && closeBtn) {
            // Function to hide popup with animation
            const hidePopup = () => {
                popup.classList.add('hiding');
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 500);
            };

            // Close button click handler
            closeBtn.onclick = hidePopup;

            // Auto-hide after 7 seconds
            setTimeout(hidePopup, 7000);

            // Hide popup when theme is toggled
            themeToggle.addEventListener('click', hidePopup);
        }
    });
});