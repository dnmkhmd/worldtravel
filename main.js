
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Logic
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Отправлено!';
            btn.style.background = '#28a745';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                form.reset();
                alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
                // Reset to default state
                toggleContactInput();
            }, 1500);
        });
    }

    // Initialize toggle state
    toggleContactInput(); // Ensure correct state on load

    // Add simple entrance clean animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.feature-card, .media-item, .traveler-card');
    hiddenElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Exposed function for the radio buttons logic
function toggleContactInput() {
    const method = document.querySelector('input[name="contact-method"]:checked').value;
    const inputGroup = document.getElementById('contact-input-group');
    const messengerChoice = document.getElementById('messenger-choice');

    // Clear previous input
    inputGroup.innerHTML = '';

    if (method === 'call') {
        // Phone Input
        const input = document.createElement('input');
        input.type = 'tel';
        input.className = 'input-field';
        input.placeholder = 'Номер телефона (+7...)';
        input.required = true;
        inputGroup.appendChild(input);

        messengerChoice.classList.add('hidden');
    } else {
        // WhatsApp/Messenger selection
        const input = document.createElement('input');
        input.type = 'text'; // Can be phone or username
        input.className = 'input-field';
        input.placeholder = 'Ваш номер или никнейм';
        input.required = true;
        inputGroup.appendChild(input);

        messengerChoice.classList.remove('hidden');
    }
}
