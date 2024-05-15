document.addEventListener('DOMContentLoaded', function() {
    const jackpotImage = document.getElementById('jackpotImage');
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Add more image URLs as needed

    let score = 0; // Initialize score counter
    let exampleJackpot = ''; // Initialize example jackpot
    let jackpotCombination = {}; // Object to store jackpot combinations

    // Define your jackpot combinations here
    jackpotCombination = {
        'image1.jpg,image1.jpg,image1.jpg': 'LikesExample.jpg',
        'image2.jpg,image2.jpg,image2.jpg': 'MindExample.jpg',
        'image3.jpg,image3.jpg,image3.jpg': 'MemeExample.jpg'
    };

    // Adjustable parameters for jackpot frequency based on example jackpot images
    const exampleJackpotFrequency = {
        'LikesExample.jpg': {
            'image1.jpg': 10, // Increase the frequency of image1.jpg when LikesExample.jpg appears
            'image2.jpg': 2, // Increase the frequency of image2.jpg when LikesExample.jpg appears
            'image3.jpg': 1 // Default frequency for image3.jpg when LikesExample.jpg appears
        },
        'MindExample.jpg': {
            'image1.jpg': 2, // Increase the frequency of image1.jpg when MindExample.jpg appears
            'image2.jpg': 10, // Increase the frequency of image2.jpg when MindExample.jpg appears
            'image3.jpg': 1 // Default frequency for image3.jpg when MindExample.jpg appears
        },
        'MemeExample.jpg': {
            'image1.jpg': 1, // Default frequency for image1.jpg when MemeExample.jpg appears
            'image2.jpg': 2, // Increase the frequency of image2.jpg when MemeExample.jpg appears
            'image3.jpg': 10 // Increase the frequency of image3.jpg when MemeExample.jpg appears
        }
    };

    setRandomJackpotImage(); // Set initial example jackpot image

    let spinning = false; // Flag to check if spinning is in progress

    document.getElementById('spinButton').addEventListener('click', spin); // Add event listener to spin button

    function setRandomJackpotImage() {
        // Get a random combination from jackpotCombination object
        const keys = Object.keys(jackpotCombination);
        exampleJackpot = jackpotCombination[keys[Math.floor(Math.random() * keys.length)]];
        // Set the example jackpot image
        jackpotImage.src = exampleJackpot;
    }

    function spin() {
        if (spinning) return; // Prevent multiple spins
        spinning = true; // Set spinning flag

        const slots = document.querySelectorAll('.slot');
        const results = [];
        slots.forEach(slot => {
            // Start flashing animation
            flashImages(slot);
        });

        // Play sound during the flashing animation
        const flashingSound = playFlashingSound();

        // After 2.5 seconds, stop flashing and check for jackpot
        setTimeout(() => {
            slots.forEach(slot => {
                // Stop flashing animation
                clearInterval(slot.flashInterval);
                // Set final image
                const randomIndex = getRandomImageIndex();
                slot.style.backgroundImage = `url(${images[randomIndex]})`;
                results.push(images[randomIndex]);
            });

            const resultKey = results.join(',');
            if (jackpotCombination[resultKey] && jackpotCombination[resultKey] === exampleJackpot) {
                score++;
                document.querySelector('.score').innerText = score;
                updateExampleJackpot(); // Update example jackpot image
                playJackpotSound(); // Play sound when jackpot is achieved
            }

            spinning = false; // Reset spinning flag
            // Stop flashing sound when flashing animation stops
            flashingSound.pause();
        }, 2500); // 2.5 seconds
    }

    // Flash images inside the slot
    function flashImages(slot) {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            const randomIndex = getRandomImageIndex();
            slot.style.backgroundImage = `url(${images[randomIndex]})`;
            flashCount++;
            if (flashCount >= 22) {
                clearInterval(flashInterval); // Stop flashing after 22 iterations
            }
        }, 100); // Flash every 100 milliseconds
        slot.flashInterval = flashInterval; // Save interval reference
    }

    // Get a random image index with adjusted jackpot frequency based on example jackpot image
    function getRandomImageIndex() {
        const weightedImages = [];
        const frequencyMapping = exampleJackpotFrequency[exampleJackpot] || {}; // Get frequency mapping for the current example jackpot
        for (let i = 0; i < images.length; i++) {
            for (let j = 0; j < (frequencyMapping[images[i]] || 1); j++) {
                weightedImages.push(i);
            }
        }
        return weightedImages[Math.floor(Math.random() * weightedImages.length)];
    }

    // Update example jackpot image based on the achieved jackpot
    function updateExampleJackpot() {
        setRandomJackpotImage(); // Refresh example jackpot image
    }

    // Function to play jackpot sound
    function playJackpotSound() {
        const sound = new Audio('sounds/Win Game Sound.mp3'); // Adjust the path to your sound file
        sound.play();
    }

    // Function to play sound during the flashing animation
    function playFlashingSound() {
        const flashingSound = new Audio('sounds/Jackpot.mp3'); // Adjust the path to your sound file
        flashingSound.volume = 0.1; // Adjustable volume (0 to 1)
        flashingSound.loop = true; // Loop the sound during the animation
        flashingSound.play();
        return flashingSound; // Return the audio object for later control
    }
});
