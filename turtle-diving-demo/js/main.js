/* --- TURTLE DIVING RESORT CORE JAVASCRIPT --- */

document.addEventListener("DOMContentLoaded", () => {
     
    // 1. MOBILE DRAWER NAVIGATION MENU
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", !isExpanded);
            navToggle.classList.toggle("active");
            mainNav.classList.toggle("active");
            
            // Toggle body scrolling to prevent layout shifting on mobile
            document.body.style.overflow = mainNav.classList.contains("active") ? "hidden" : "";
        });

        // Close navigation menu once link gets tapped
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
                mainNav.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
    }

    // 2. ACTIVE NAVIGATION STATE & SCROLL OFFSET
    const sections = document.querySelectorAll("section[id]");
    
    window.addEventListener("scroll", () => {
        // Sticky menu header is exactly 80px high (using 90px threshold offset)
        const currentScroll = window.pageYOffset + 90;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute("id");

            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
                const activeLink = document.querySelector(`.main-nav a[href*="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    });

    // 3. MAP SPOT PIN TRIGGER & IN-MAP OVERLAY CARD SWITCHING
    const mapPins = document.querySelectorAll(".map-interactive-pin");
    const spotPopup = document.getElementById("spot-detail-popup");
    const popupIcon = document.getElementById("popup-spot-icon");
    const popupTitle = document.getElementById("popup-spot-title");
    const popupDesc = document.getElementById("popup-spot-desc");
    const popupCloseBtn = document.getElementById("spot-popup-close-btn");

    if (mapPins.length > 0 && spotPopup) {
        mapPins.forEach(pin => {
            pin.addEventListener("click", () => {
                // Remove active styling classes from all map pins
                mapPins.forEach(p => p.classList.remove("active"));
                
                // Add active style mapping to clicked pin element
                pin.classList.add("active");

                // Retrieve spot specifications from pin data attributes
                const spotTitle = pin.getAttribute("data-title");
                const spotDesc = pin.getAttribute("data-desc");
                const spotIcon = pin.getAttribute("data-icon");

                // Dynamically populate the absolute floating card popup elements
                if (popupTitle) popupTitle.textContent = spotTitle;
                if (popupDesc) popupDesc.textContent = spotDesc;
                if (popupIcon) popupIcon.setAttribute("src", spotIcon);

                // Show the detailed in-map popup overlay
                spotPopup.classList.add("active");
            });
        });
    }

    // Close spot details popup overlay on clicking close button
    if (popupCloseBtn && spotPopup) {
        popupCloseBtn.addEventListener("click", () => {
            spotPopup.classList.remove("active");
            mapPins.forEach(pin => pin.classList.remove("active"));
        });
    }

    // 4. COURSE SELECTION & DETAIL OVERLAY (Triggered strictly by the mandatory "mehr" text link)
    const courseMoreLinks = document.querySelectorAll(".course-more-link");
    const courseOverlay = document.getElementById("course-detail-overlay");
    const courseModalImg = document.getElementById("popup-course-img");
    const courseModalTitle = document.getElementById("popup-course-title");
    const courseModalDesc = document.getElementById("popup-course-desc");
    const courseModalPrice = document.getElementById("popup-course-price");
    const courseModalDuration = document.getElementById("popup-course-duration");
    const courseModalDates = document.getElementById("popup-course-dates");
    const courseModalClose = document.getElementById("course-popup-close-btn");
    const courseModalCTA = document.getElementById("course-cta-book-btn");

    // Track active selected course ID globally for the CTA form linking
    let activeCourseId = "";

    if (courseMoreLinks.length > 0 && courseOverlay) {
        courseMoreLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                // Find the parent course item container to extract details
                const card = link.closest(".course-item");
                if (!card) return;

                // Remove active states from all cards
                document.querySelectorAll(".course-item").forEach(c => c.classList.remove("active"));
                
                // Add active state to selected course container
                card.classList.add("active");

                // Extract parameters from card data-attributes
                activeCourseId = card.getAttribute("data-course");
                const title = card.getAttribute("data-title");
                const desc = card.getAttribute("data-desc");
                const price = card.getAttribute("data-price");
                const duration = card.getAttribute("data-duration");
                const dates = card.getAttribute("data-dates");
                const image = card.getAttribute("data-image");

                // Populate modal window elements
                if (courseModalTitle) courseModalTitle.textContent = title;
                if (courseModalDesc) courseModalDesc.textContent = desc;
                if (courseModalPrice) courseModalPrice.textContent = price;
                if (courseModalDuration) courseModalDuration.textContent = duration;
                if (courseModalDates) courseModalDates.textContent = dates;
                if (courseModalImg) courseModalImg.setAttribute("src", image);

                // Launch Course modal overlay
                courseOverlay.classList.add("active");
            });
        });
    }

    // Close Course modal on close button trigger
    if (courseModalClose && courseOverlay) {
        courseModalClose.addEventListener("click", () => {
            courseOverlay.classList.remove("active");
            document.querySelectorAll(".course-item").forEach(c => c.classList.remove("active"));
        });

        // Close on clicking modal backdrop blur
        courseOverlay.addEventListener("click", (e) => {
            if (e.target === courseOverlay) {
                courseOverlay.classList.remove("active");
                document.querySelectorAll(".course-item").forEach(c => c.classList.remove("active"));
            }
        });
    }

    // Modal CTA Click linking directly to the booking form & auto-selecting options
    if (courseModalCTA && courseOverlay) {
        courseModalCTA.addEventListener("click", () => {
            // Close modal overlay window
            courseOverlay.classList.remove("active");
            document.querySelectorAll(".course-item").forEach(c => c.classList.remove("active"));

            // Pre-select chosen course inside dropdown select field
            const courseSelect = document.getElementById("course-select");
            if (courseSelect && activeCourseId) {
                courseSelect.value = activeCourseId;
                // Dispatch change event to trigger the updateDates() function
                courseSelect.dispatchEvent(new Event("change"));
            }

            // Smooth scroll viewport to the pre-filled Booking Form container
            const bookingSec = document.querySelector(".booking-container");
            if (bookingSec) {
                bookingSec.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }

    // 5. DIALOG POPUP SYSTEM (No unstyled window.alert blocks)
    const customModal = document.getElementById("custom-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    function showModal(title, text) {
        if (customModal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.textContent = text;
            customModal.classList.add("active");
        }
    }

    if (modalCloseBtn && customModal) {
        modalCloseBtn.addEventListener("click", () => {
            customModal.classList.remove("active");
        });
        
        customModal.addEventListener("click", (e) => {
            if (e.target === customModal) {
                customModal.classList.remove("active");
            }
        });
    }

    // 6. BOOKING FORM DYNAMIC DATES SELECTION
    const courseSelect = document.getElementById("course-select");
    const dateSelect = document.getElementById("date-select");

    const courseDates = {
        "schnuppertauchen": [
            "01.06.2026",
            "08.06.2026",
            "15.06.2026",
            "22.06.2026",
            "29.06.2026"
        ],
        "open-water": [
            "02.06.2026 – 05.06.2026",
            "09.06.2026 – 12.06.2026",
            "16.06.2026 – 19.06.2026",
            "23.06.2026 – 26.06.2026",
            "30.06.2026 – 03.07.2026"
        ],
        "advanced": [
            "03.06.2026 – 06.06.2026",
            "10.06.2026 – 13.06.2026",
            "17.06.2026 – 20.06.2026",
            "24.06.2026 – 27.06.2026",
            "01.07.2026 – 04.07.2026"
        ],
        "rescue": [
            "03.06.2026",
            "10.06.2026",
            "17.06.2026",
            "24.06.2026",
            "01.07.2026"
        ],
        "reactivate": [
            "Wunschtermin 1",
            "Wunschtermin 2",
            "Wunschtermin 3",
            "Wunschtermin 4",
            "Wunschtermin 5"
        ]
    };

    function updateDates() {
        const selectedCourse = courseSelect.value;
        // Reset and clear option values
        dateSelect.innerHTML = '<option value="" disabled selected>Bitte wählen...</option>';
        
        if (selectedCourse && courseDates[selectedCourse]) {
            courseDates[selectedCourse].forEach(date => {
                const opt = document.createElement("option");
                opt.value = date;
                opt.textContent = date;
                dateSelect.appendChild(opt);
            });
            dateSelect.disabled = false;
        } else {
            dateSelect.disabled = true;
        }
    }

    if (courseSelect && dateSelect) {
        courseSelect.addEventListener("change", updateDates);
    }

    // 7. BOOKING FORM SUBMISSION
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const selectedCourseText = courseSelect.options[courseSelect.selectedIndex].text;
            const userName = document.getElementById("user-name").value;

            showModal(
                "Buchung registriert!", 
                `Vielen Dank, ${userName}! Deine Anmeldung für den Kurs "${selectedCourseText}" ist bei uns eingegangen. Wir prüfen die Termine und senden dir in Kürze alle Details per E-Mail.`
            );
            
            bookingForm.reset();
            // Trigger change event to reset date dropdown back to disabled state
            courseSelect.dispatchEvent(new Event("change"));
        });
    }

    // 8. CONTACT FORM SUBMISSION
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const contactName = document.getElementById("contact-name").value;

            showModal(
                "Nachricht verschickt!", 
                `Ahoi ${contactName}! Deine Anfrage wurde sicher übermittelt. Wir antworten dir so schnell wie möglich.`
            );

            contactForm.reset();
        });
    }
});