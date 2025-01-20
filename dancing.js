// 1) Select all "single-dancing-letter" containers
const letters = document.querySelectorAll('.single-dancing-letter');

// 2) Define possible image variants for each letter type
//    (Adjust filenames to match your actual setup)
const letterVariants = {
    a: ['src/ltrs/a.png', 'src/ltrs/a2.png', 'src/ltrs/a3.png'],
    l: ['src/ltrs/l.png', 'src/ltrs/l2.png', 'src/ltrs/l3.png'],
    i: ['src/ltrs/i.png', 'src/ltrs/i2.png', 'src/ltrs/i3.png'],
    b: ['src/ltrs/b.png', 'src/ltrs/b2.png', 'src/ltrs/b3.png'],
    i2: ['src/ltrs/i2.png', 'src/ltrs/i.png', 'src/ltrs/i3.png']
};

// 3) We'll track each letter's current state in a Map or object.
//    - currentTick: increments every interval
//    - nextChange: random threshold between 3-7 ticks
//    - currentImageIndex: which image index it's currently using
const letterStates = new Map();

// Helper function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    // e.g. getRandomInt(3, 7) returns a random integer between 3 and 7.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize each letter's state
letters.forEach(letter => {
    const letterType = letter.dataset.letter;
    const img = letter.querySelector('img');

    // Find which variant index is used by default:
    // For simplicity, let's assume the first image in letterVariants[letterType] is the default.
    // If you want to detect the actual index from the src, you can do that here.
    const variants = letterVariants[letterType];
    let currentImageIndex = 0;
    // If the default image is not at index 0, you could:
    // currentImageIndex = variants.indexOf(img.src);
    // if needed, but only if paths match exactly.

    letterStates.set(letter, {
        currentTick: 0,
        nextChange: getRandomInt(3, 7),
        currentImageIndex
    });
});

// 4) Rotate each letter randomly between -30° and 30°
function rotateLettersRandomly() {
    letters.forEach(letter => {
        const randomRotation = Math.floor(Math.random() * 61) - 30; // [-30 .. 30]
        letter.style.transform = `rotate(${randomRotation}deg)`;
    });
}

// 5) Attempt to change an individual letter's image if its tick count
//    reaches its threshold (between 3 and 7). The new image must be
//    different from the current one.
function maybeSwapLetterImage(letter) {
    const letterType = letter.dataset.letter;
    const variants = letterVariants[letterType];
    const state = letterStates.get(letter);
    const img = letter.querySelector('img');

    // Increase the tick count
    state.currentTick++;

    // Check if it's time to change
    if (state.currentTick >= state.nextChange) {
        // Pick a different image index from the one currently in use
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * variants.length);
        } while (newIndex === state.currentImageIndex);

        // Update the image src
        state.currentImageIndex = newIndex;
        img.src = variants[newIndex];

        // Reset tick count
        state.currentTick = 0;

        // Randomize nextChange for the next cycle (between 3 and 7 again)
        state.nextChange = getRandomInt(3, 7);
    }
}

// 6) Initialize: rotate letters once at the start
rotateLettersRandomly();

// 7) SetInterval: every 700ms, rotate and maybe swap images
setInterval(() => {
    // Rotate letters
    rotateLettersRandomly();

    // Check each letter if it needs to swap image
    letters.forEach(letter => {
        maybeSwapLetterImage(letter);
    });
}, 700);
