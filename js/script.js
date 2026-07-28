/* js/script.js */

// 1. SMOOTH SCROLL TO TOP
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 2. ACCESSIBILITY MENU TOGGLE
function toggleAccessMenu() {
    const menu = document.getElementById('accessOptions');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// 3. FONT SCALING LOGIC (With Persistence)
let currentScale = 100; 

function changeFontSize(action) {
    if (action === 'increase' && currentScale < 130) {
        currentScale += 5;
    } else if (action === 'decrease' && currentScale > 85) {
        currentScale -= 5;
    } else if (action === 'reset') {
        currentScale = 100; 
    }
    
    // Apply the new size
    document.documentElement.style.setProperty('--base-font-size', currentScale + '%');
    
    // Save to memory
    localStorage.setItem('fontSize', currentScale);
}

// 4. HIGH CONTRAST (DARK MODE) TOGGLE
function toggleContrast() {
    const body = document.body;
    body.classList.toggle('high-contrast');
    
    // Save preference
    const isHighContrast = body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
}

// 5. HEADER BACKGROUND BLUR ON SCROLL
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// 6. INITIALIZE SETTINGS ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    
    // A. Check Dark Mode Memory
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // B. Check Font Size Memory
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
        currentScale = parseInt(savedSize, 10);
        document.documentElement.style.setProperty('--base-font-size', currentScale + '%');
    }
    
    // C. Close accessibility menu if clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.querySelector('.accessibility-menu');
        const options = document.getElementById('accessOptions');
        if (menu && options && !menu.contains(e.target)) {
            options.classList.remove('active');
        }
    });
});

// 7. LIGHTBOX FUNCTIONALITY
function openLightbox(imageSrc, fitNoScroll = false) {
    const modal = document.getElementById('lightboxModal');
    const targetImg = document.getElementById('lightboxTargetImg');
    
    if (modal && targetImg) {
        targetImg.src = imageSrc;
        
        // Add fit-lightbox class if specified (e.g. Moodboards)
        if (fitNoScroll) {
            modal.classList.add('fit-lightbox');
        } else {
            modal.classList.remove('fit-lightbox');
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    }
}

function closeLightbox(event) {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('fit-lightbox');
        document.body.style.overflow = ''; // Re-enable background scrolling
    }
}

// Close Lightbox on 'Escape' Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// 8. CAROUSEL / SLIDER NAVIGATION (Autoplay + Peeking Slides)
const sliderPositions = {};
const sliderIntervals = {};

function initSliders() {
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(container => {
        const sliderId = container.id;
        if (!sliderId) return;

        const track = container.querySelector('.slider-track');
        const slides = track ? track.querySelectorAll('.slide-item') : [];
        const totalSlides = slides.length;
        if (totalSlides === 0) return;

        sliderPositions[sliderId] = 0;

        // Start Autoplay (every 3.5 seconds)
        startAutoplay(sliderId);

        // Pause on Mouse Hover
        const wrapper = container.parentElement;
        wrapper.addEventListener('mouseenter', () => stopAutoplay(sliderId));
        wrapper.addEventListener('mouseleave', () => startAutoplay(sliderId));
    });
}

function moveSlider(sliderId, direction) {
    const container = document.getElementById(sliderId);
    if (!container) return;
    
    const track = container.querySelector('.slider-track');
    const slides = track ? track.querySelectorAll('.slide-item') : [];
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    if (!(sliderId in sliderPositions)) {
        sliderPositions[sliderId] = 0;
    }
    
    sliderPositions[sliderId] += direction;
    
    if (sliderPositions[sliderId] < 0) {
        sliderPositions[sliderId] = totalSlides - 1;
    } else if (sliderPositions[sliderId] >= totalSlides) {
        sliderPositions[sliderId] = 0;
    }
    
    const percentage = -(sliderPositions[sliderId] * 100);
    track.style.transform = `translateX(${percentage}%)`;
}

function startAutoplay(sliderId) {
    stopAutoplay(sliderId);
    sliderIntervals[sliderId] = setInterval(() => {
        moveSlider(sliderId, 1);
    }, 3500);
}

function stopAutoplay(sliderId) {
    if (sliderIntervals[sliderId]) {
        clearInterval(sliderIntervals[sliderId]);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initSliders();
});