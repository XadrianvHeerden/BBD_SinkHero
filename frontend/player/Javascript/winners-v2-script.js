// document.addEventListener('DOMContentLoaded', function() {
//     const cards = document.querySelectorAll('.points-card');
//     cards.forEach(card => {
//         card.addEventListener('click', function() {
//             card.classList.add('stop-wiggle');
//         });
//     });
// });


document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.points-card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (card.classList.contains('stop-wiggle')) {
                startWiggle(card);
            } else {
                stopWiggle(card);
            }
        });
    });

    function stopWiggle(card) {
        card.classList.add('stop-wiggle');
        card.style.animation = 'none';
    }

    function startWiggle(card) {
        card.classList.remove('stop-wiggle');
        // Trigger reflow to restart the animation
        void card.offsetWidth;
        card.style.animation = '';
        card.classList.add('wiggle');
    }
});
