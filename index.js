console.log("index.js loaded");
import Stack from './Stack.js';
import * as Carousel from './Carousel.js';  // Import Carousel functions

const viewedRobots = new Stack();
const favoriteRobots = new Stack();

const robotCategories = [
    { name: 'Home Robot', value: 'home robot, household, robotics, robot, housework' },
    { name: 'Work Robot', value: 'work robot, office assistant, robotics, robot' },
    { name: 'Security Robot', value: 'security robot, ai generated, robotics, police, futuristic, surveillance, robotics, robot' },
    { name: 'Cleaning Robot', value: 'cleaning robot, household, cleaning, robotics, robot, housework' },
    { name: 'Companion Robot', value: 'companion robot, ai generated, brunette, woman, humanoid, robotics, robot, assistant' },
    { name: 'Entertainment Robot', value: 'entertainment robot, ai generated, cute, baby, robot, robotics, toy, fun' }
];

const API_KEY = '45772807-';

const dropdown = document.getElementById('robotSelect');
robotCategories.forEach(category => {
    const option = document.createElement('option');
    option.textContent = category.name;
    option.value = category.value;
    dropdown.appendChild(option);
});

// Robot Selection
document.getElementById('robotSelect').addEventListener('change', async () => {
    const selectedCategory = document.getElementById('robotSelect').value;

    console.log(`Selected Category: ${selectedCategory}`); // Debugging

    // Using Axios to fetch data from the API
    try {
        const response = await axios.get('https://pixabay.com/api/?key=45772807-c48b2021298f56f2bf7193743&q=robots&image_type=photo', {
            params: {
                key: API_KEY,
                q: `${selectedCategory} robot`,  
                image_type: 'photo',
                safesearch: true,
                per_page: 10
            }
        });

        const robotData = response.data.hits;
        console.log(robotData); 

        if (robotData.length > 0) {
            Carousel.clear();  // Clear the existing carousel 

            robotData.forEach((robot, index) => {
                viewedRobots.push(robot);

                // Updating the carousel
                const carouselItem = Carousel.createCarouselItem(robot.previewURL, robot.tags, robot.id);
                Carousel.appendCarousel(carouselItem);
                
                console.log(`Rendering robot ${index + 1}:`, robot);
            });
// Attaching the like button event listener
            document.querySelectorAll('.favourite-button').forEach((button, index) => {
                button.addEventListener('click', () => {
                    handleLikeButton(robotData[index]);
                });
            });

            // Update the info section with the first robot's description
            document.getElementById('infoDump').innerText = robotData[0].tags;
        } else {
            document.getElementById('infoDump').innerText = "No robots found for this category.";
        }
            Carousel.start();

        

    } catch (error) {
        console.error('Error fetching robots:', error);  // Log errors
    }
});

// Like button 
export function handleLikeButton(robotData) {
    let isFavorite = false;

    // Check if robot is in favorites 
    for (let i = 0; i < favoriteRobots.size(); i++) {
        if (favoriteRobots.items[i].id === robotData.id) {
            isFavorite = true;
            favoriteRobots.items.splice(i, 1);  // Remove from favorites
            break;
        }
    }

    if (!isFavorite) {
        favoriteRobots.push(robotData);  // Add to favorites
    }

    console.log('Favorites:', favoriteRobots.items);  
}

// View favorites
document.getElementById('getFavouritesBtn').addEventListener('click', () => {
    Carousel.clear();  // Clearing the carousel

    for (let i = 0; i < favoriteRobots.size(); i++) {
        const robotData = favoriteRobots.items[i];
        const carouselItem = Carousel.createCarouselItem(robotData.previewURL, robotData.tags, robotData.id);
        Carousel.appendCarousel(carouselItem);
    }

    if (favoriteRobots.isEmpty()) {
        document.getElementById('infoDump').innerText = "You have no favorite robots.";
    }
});
