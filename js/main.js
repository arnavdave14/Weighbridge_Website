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

    // Reduced counts for performance
    const layer1 = createParticles(400, 0.015, '#2563eb', 0.0003);
    const layer2 = createParticles(200, 0.025, '#0891b2', 0.0005);
    const layer3 = createParticles(100, 0.04, '#e11d48', 0.0008);
    
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
    if (!truck) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".interactive-process",
            start: "top 60%",
            end: "bottom 20%",
            scrub: 1,
            // markers: true
        }
    });

    tl.to(truck, { left: "10%", duration: 1 })
      .add(() => nodes[0].classList.add('active'), "-=0.1")
      .to(truck, { left: "30%", duration: 1.5, delay: 0.2 })
      .add(() => nodes[1].classList.add('active'), "-=0.1")
      .to(truck, { left: "50%", duration: 1.5, delay: 0.2 })
      .add(() => nodes[2].classList.add('active'), "-=0.1")
      .to(truck, { left: "70%", duration: 1.5, delay: 0.2 })
      .add(() => nodes[3].classList.add('active'), "-=0.1")
      .to(truck, { left: "90%", duration: 1.5, delay: 0.2 })
      .add(() => nodes[4].classList.add('active'), "-=0.1")
      .to(truck, { left: "110%", duration: 1 });
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
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    
    window.addEventListener('mousemove', (e) => {
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

        setTimeout(() => {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
            
            form.reset();
            successMsg.style.display = 'flex';
            gsap.from(successMsg, { y: 10, opacity: 0, duration: 0.5 });
        }, 2000);
    });
}

function initEntranceAnimations() {
    const masterTl = gsap.timeline();
    masterTl.from(".glass-nav", { y: -100, opacity: 0, duration: 1, ease: "power4.out" })
            .from(".hero h1", { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" }, "-=0.5")
            .from(".hero-sub", { y: 30, opacity: 0, duration: 1 }, "-=0.8")
            .from(".hero-btns", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
            .from(".reveal-visual", { x: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1");
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initThreeHero();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) heroObserver.observe(heroSection);

    initProcessFlow();
    initDashboard();
    initFormHandling();
    initUI();
    lucide.createIcons();
});

