// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

console.log("Aaravya Main JS v2.1 Loaded");

let lenis; // Global Lenis instance

// 1. THREE.JS HERO BACKGROUND (Upgraded)
function initThreeHero() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        alpha: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Multi-layered Particles
    function createParticles(count, size, color, speed) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for(let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            size: size,
            color: color,
            transparent: true,
            opacity: 0.4, // Increased for better visibility in light mode
            blending: THREE.NormalBlending 
        });
        const points = new THREE.Points(geometry, material);
        points.userData.speed = speed;
        return points;
    }

    // Optimized Particle Counts
    const layer1 = createParticles(200, 0.015, '#2563eb', 0.0003);
    const layer2 = createParticles(100, 0.025, '#0891b2', 0.0005);
    const layer3 = createParticles(50, 0.04, '#e11d48', 0.0008);
    
    scene.add(layer1, layer2, layer3);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        [layer1, layer2, layer3].forEach((layer, i) => {
            layer.rotation.y += layer.userData.speed;
            layer.rotation.x += layer.userData.speed * 0.5;
            // Parallax based on depth
            layer.position.x = targetX * (i + 1) * 0.5;
            layer.position.y = -targetY * (i + 1) * 0.5;
        });

        camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-targetY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 2. INTERACTIVE PROCESS FLOW (GSAP Timeline)
function initProcessFlow() {
    const truck = document.getElementById('truck-svg');
    const nodes = document.querySelectorAll('.process-node');
    const progressBar = document.getElementById('truck-progress');
    if (!truck) return;

    // Set initial states for nodes
    gsap.set(nodes, { borderColor: "rgba(0,0,0,0.05)", backgroundColor: "rgba(255,255,255,0.02)", boxShadow: "0 0 0px rgba(0,0,0,0)" });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#process",
            start: "top 60%",
            end: "bottom 20%",
            scrub: 1,
        }
    });

    const activeStyle = { 
        borderColor: "#2563eb", 
        backgroundColor: "rgba(37, 99, 235, 0.1)", 
        boxShadow: "0 0 20px rgba(37, 99, 235, 0.15)",
        duration: 0.3 
    };

    tl.to(truck, { left: "10%", duration: 1 })
      .to(progressBar, { width: "10%", duration: 1 }, "<")
      .to(nodes[0], activeStyle, "-=0.1")
      .to(nodes[0].querySelector('.node-info'), { opacity: 1, color: "#020617", duration: 0.3 }, "-=0.3")
      
      .to(truck, { left: "30%", duration: 1.5, delay: 0.2 })
      .to(progressBar, { width: "30%", duration: 1.5 }, "<")
      .to(nodes[1], activeStyle, "-=0.1")
      .to(nodes[1].querySelector('.node-info'), { opacity: 1, color: "#020617", duration: 0.3 }, "-=0.3")
      
      .to(truck, { left: "50%", duration: 1.5, delay: 0.2 })
      .to(progressBar, { width: "50%", duration: 1.5 }, "<")
      .to(nodes[2], activeStyle, "-=0.1")
      .to(nodes[2].querySelector('.node-info'), { opacity: 1, color: "#020617", duration: 0.3 }, "-=0.3")
      
      .to(truck, { left: "70%", duration: 1.5, delay: 0.2 })
      .to(progressBar, { width: "70%", duration: 1.5 }, "<")
      .to(nodes[3], activeStyle, "-=0.1")
      .to(nodes[3].querySelector('.node-info'), { opacity: 1, color: "#020617", duration: 0.3 }, "-=0.3")
      
      .to(truck, { left: "90%", duration: 1.5, delay: 0.2 })
      .to(progressBar, { width: "90%", duration: 1.5 }, "<")
      .to(nodes[4], activeStyle, "-=0.1")
      .to(nodes[4].querySelector('.node-info'), { opacity: 1, color: "#020617", duration: 0.3 }, "-=0.3")
      
      .to(truck, { left: "110%", duration: 1 })
      .to(progressBar, { width: "100%", duration: 1 }, "<");
}

// 3. DASHBOARD INTERACTION
function initDashboard() {
    const container = document.getElementById('dashboard-container');
    const img = document.getElementById('dashboard-img');
    if (!container) return;

    container.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(img, {
            rotationY: x * 10,
            rotationX: -y * 10,
            x: x * 20,
            y: y * 20,
            duration: 0.5,
            ease: "power2.out"
        });

        // Update glare
        const glare = container.querySelector('.dashboard-glare');
        if (glare) {
            gsap.to(glare, {
                opacity: 0.2,
                background: `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(255,255,255,0.3), transparent 60%)`,
                duration: 0.3
            });
        }
    });

    container.addEventListener('mouseleave', () => {
        gsap.to(img, { rotationY: 0, rotationX: 0, x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
    });
}

// 4. GSAP ANIMATIONS & UI
function initUI() {
    if (!lenis) return;
    
    // Header Scroll Effect
    const nav = document.querySelector('.glass-nav');
    lenis.on('scroll', (e) => {
        if (e.animatedScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-primary, .bg-dark, .bg-primary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // Mobile Menu Toggle with Icon Switch
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        
        // Toggle Icon between Menu and X
        const icon = menuToggle.querySelector('i');
        if (isActive) {
            icon.setAttribute('data-lucide', 'x');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        } else {
            icon.setAttribute('data-lucide', 'menu');
            document.body.style.overflow = ''; // Restore scroll
        }
        lucide.createIcons();
        
        // Tailwind Toggle for visibility
        navLinks.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.click();
            }
        });
    });

    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    
    let lastMove = 0;
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMove < 16) return; // Throttle to ~60fps
        lastMove = now;
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    // Meaningful Interactions
    document.querySelectorAll('a, button, .feature-card, .process-node').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3, opacity: 0.3, duration: 0.3 });
            follower.classList.add('expand');
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
            follower.classList.remove('expand');
        });
    });

    // Sticky CTA Logic
    const stickyCta = document.getElementById('sticky-cta');
    ScrollTrigger.create({
        start: "top -100",
        onUpdate: (self) => {
            if (self.direction === 1) { // Scrolling down
                stickyCta.classList.add('visible');
            } else if (self.scroll() < 200) {
                stickyCta.classList.remove('visible');
            }
        }
    });

    // Glow on hover for buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const { left, top } = btn.getBoundingClientRect();
            btn.style.setProperty('--x', `${e.clientX - left}px`);
            btn.style.setProperty('--y', `${e.clientY - top}px`);
        });
    });

    // Hotspot Clicks
    document.querySelectorAll('.hotspot').forEach(spot => {
        spot.addEventListener('click', () => {
            const target = document.querySelector('#contact');
            if (target) {
                gsap.to(window, { duration: 1.5, scrollTo: { y: target, offsetY: 80 }, ease: "power4.inOut" });
            }
        });
    });

    // Testimonial Auto-Slider (Upgraded)
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length > 1) {
        let current = 0;
        setInterval(() => {
            gsap.to(testimonials[current], { opacity: 0, x: -20, duration: 0.5 });
            current = (current + 1) % testimonials.length;
            gsap.fromTo(testimonials[current], 
                { opacity: 0, x: 20 }, 
                { opacity: 1, x: 0, duration: 0.5 }
            );
        }, 6000);
    }
}

function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const btn = document.getElementById('newsletter-btn');
    const successMsg = document.getElementById('newsletter-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        btn.disabled = true;
        btn.innerText = "...";

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            if (response.status == 200) {
                successMsg.classList.remove('hidden');
                form.reset();
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 5000);
            }
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "Join";
        });
    });
}

// 5. STAT COUNTERS
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    ScrollTrigger.create({
        trigger: "#stats",
        start: "top 80%",
        onEnter: () => {
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = counter.getAttribute('data-target').includes('.');
                
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: isDecimal ? 0.01 : 1 },
                    onUpdate: function() {
                        if (isDecimal) {
                            counter.innerText = parseFloat(counter.innerText).toFixed(2);
                        }
                    }
                });
            });
        },
        once: true // Only animate once
    });
}

// 6. SCROLL TO TOP
function initScrollToTop() {
    const btn = document.getElementById('back-to-top');
    const circle = document.getElementById('progress-circle');
    const percentText = document.getElementById('scroll-percent');
    if (!btn || !lenis) return;

    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const scrollPercent = Math.round((currentScroll / scrollTotal) * 100);
        
        // Update Circle
        if (circle) {
            const circumference = 283; // 2 * pi * r (r=45)
            const offset = circumference - (scrollPercent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        // Update Text
        if (percentText) {
            percentText.textContent = `${scrollPercent}%`;
        }

        // Show/Hide Button
        if (currentScroll > 500) {
            btn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            btn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            btn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            btn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    });

    btn.addEventListener('click', () => {
        lenis.scrollTo(0, {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });
}

// 5. PRELOADER & FORM HANDLING
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
                initEntranceAnimations();
            }
        });
    });
}

function initFormHandling() {
    const form = document.getElementById('main-contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // 1. Format WhatsApp Message
        const waMessage = `*New Inquiry - Aaravya Enterprises*%0A%0A` +
                        `*Name:* ${object.name}%0A` +
                        `*Phone:* ${object.phone}%0A` +
                        `*Email:* ${object.email}%0A` +
                        `*Message:* ${object.message}`;
        
        const waUrl = `https://wa.me/919893224689?text=${waMessage}`;

        // 2. Send to Email (Web3Forms)
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            if (response.status == 200) {
                // Success UI
                successMsg.style.display = 'flex';
                gsap.from(successMsg, { y: 10, opacity: 0, duration: 0.5 });
                form.reset();
                
                // 3. Open WhatsApp in a new tab
                window.open(waUrl, '_blank');
            } else {
                errorMsg.style.display = 'flex';
            }
        })
        .catch(error => {
            console.error("Form Error:", error);
            errorMsg.style.display = 'flex';
        })
        .finally(() => {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        });
    });
}

function initEntranceAnimations() {
    const masterTl = gsap.timeline();
    masterTl.from(".glass-nav", { y: -100, opacity: 0, duration: 1, ease: "power4.out" })
            .from("#home h1", { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" }, "-=0.5")
            .from("#home p", { y: 30, opacity: 0, duration: 1 }, "-=0.8")
            .from("#home .flex-col.sm\\:flex-row", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
            .from("#home .relative.lg\\:block", { x: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1");
}

// 6. SMOOTH SCROLL (LENIS)
function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Sync ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-primary z-[2000] transition-all duration-100';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    lenis.on('scroll', (e) => {
        const progress = (e.animatedScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${progress}%`;
    });
    
    // Refresh ScrollTrigger after a short delay to ensure layout is ready
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);

    // Anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Robust Icon Initialization
    const tryIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            setTimeout(tryIcons, 100);
        }
    };
    tryIcons();

    initPreloader();
    initSmoothScroll();
    initUI();
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initThreeHero();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const heroSection = document.querySelector('#home');
    if (heroSection) heroObserver.observe(heroSection);

    initProcessFlow();
    initDashboard();
    initFormHandling();
    initNewsletter();
    initStatCounters();
    initScrollToTop();
    initSecurityLayer();
});
