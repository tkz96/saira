// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// // Header background change on scroll
// window.addEventListener('scroll', () => {
//     const header = document.querySelector('header');
//     if (window.scrollY > 100) {
//         header.style.background = 'rgba(255, 255, 255, 0.98)';
//         header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
//     } else {
//         header.style.background = 'rgba(255, 255, 255, 0.95)';
//         header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
//     }
// });

// Form submission handling
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Simple validation
    if (!data.name || !data.email || !data.phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate form submission
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    setTimeout(() => {
        alert('Thank you for your message! We will contact you soon to confirm your appointment.');
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});

// Service Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const serviceCategories = document.querySelectorAll('.service-category');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and categories
        tabButtons.forEach(btn => btn.classList.remove('active'));
        serviceCategories.forEach(cat => cat.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show corresponding service category
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Testimonial Carousel Functionality
const track = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.slider-dot');
const testimonials = document.querySelectorAll('.testimonial');

let currentIndex = 0;
let testimonialWidth = testimonials[0].offsetWidth + 30;
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

// Initialize carousel
updateCarousel();

// Recalculate on resize
window.addEventListener('resize', () => {
    testimonialWidth = testimonials[0].offsetWidth + 30;
    updateCarousel();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

// Auto slide
setInterval(() => {
    if (currentIndex < testimonials.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}, 5000);

function updateCarousel() {
    currentTranslate = -currentIndex * testimonialWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Dragging functionality
const touchStart = (index) => {
    return function (event) {
        currentIndex = index;
        startPosition = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        track.classList.add('grabbing');
    }
}

const touchMove = (event) => {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPosition;
    }
}

const touchEnd = () => {
    cancelAnimationFrame(animationID);
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < testimonials.length - 1) {
        currentIndex += 1;
    }

    if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    setPositionByIndex();
    track.classList.remove('grabbing');
}

const getPositionX = (event) => {
    return event.type.includes('mouse')
        ? event.pageX
        : event.touches[0].clientX;
}

const setPositionByIndex = () => {
    currentTranslate = -currentIndex * testimonialWidth;
    prevTranslate = currentTranslate;
    updateCarousel();
}

const animation = () => {
    track.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging) requestAnimationFrame(animation);
}

// Add event listeners
testimonials.forEach((testimonial, index) => {
    // Mouse events
    testimonial.addEventListener('mousedown', touchStart(index));
    testimonial.addEventListener('touchstart', touchStart(index), { passive: true });
});

window.addEventListener('mousemove', touchMove);
window.addEventListener('touchmove', touchMove, { passive: true });

window.addEventListener('mouseup', touchEnd);
window.addEventListener('touchend', touchEnd);
window.addEventListener('mouseleave', touchEnd);

// Prevent image drag
document.querySelectorAll('.testimonial img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});