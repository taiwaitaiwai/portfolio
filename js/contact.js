document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const fName = document.getElementById('first_name');
    const lName = document.getElementById('last_name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const wordCount = document.getElementById('word-count');
    const status = document.getElementById('form-status');

    // Name filtering (Keep it clean)
    const filterName = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    };

    // Word count color update
    const checkWords = () => {
        const words = message.value.trim().split(/\s+/).filter(w => w.length > 0);
        wordCount.innerText = `${words.length} / 10 words minimum`;
        wordCount.style.color = words.length >= 10 ? "#2D3436" : "#e74c3c";
    };

    fName.addEventListener('input', filterName);
    lName.addEventListener('input', filterName);
    message.addEventListener('input', checkWords);

    // Click feedback logic
    form.addEventListener('submit', (e) => {
        const words = message.value.trim().split(/\s+/).filter(w => w.length > 0);
        
        if (words.length < 10) {
            e.preventDefault();
            status.innerText = "Please write at least 10 words.";
            status.style.color = "#e74c3c";
            message.focus();
        } else if (!email.checkValidity()) {
            e.preventDefault();
            status.innerText = "Please enter a valid email address.";
            status.style.color = "#e74c3c";
        } else {
            status.innerText = "Sending...";
            status.style.color = "#2D3436";
        }
    });
});