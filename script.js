document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto'; // Prevent scrolling when menu is open
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // 2. Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation for Elements
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        // The point at which the element should start revealing
        const revealPoint = 100; 

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Trigger check immediately and on scroll
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // 4. Update Copyright Year dynamically
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 5. Active Link Highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust to trigger slightly before the section reaches the exact top
            if (scrollY >= (sectionTop - 250)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    // 6. Form Submission Handling (Visual Simulation)
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page refresh
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Visual feedback for successful send
            btn.innerHTML = 'Sent Successfully! <i class="fas fa-check-circle"></i>';
            btn.style.background = '#10b981'; // Success green color
            btn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
            
            // Reset form and button after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.background = ''; // Resets to original gradient
                btn.style.boxShadow = '';
            }, 3000);
        });
    }
});
