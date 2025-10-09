// ======================================== 
// API CONFIGURATION
// ======================================== 
const API_BASE_URL = '/Category'; // Ajusta según tu configuración

// ======================================== 
// CATEGORIES API FUNCTIONS
// ======================================== 

/**
 * Obtener todas las categorías desde el backend
 */
async function loadCategoriesFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/GetAll`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return result.data;
        } else {
            console.error('Error al obtener categorías:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        return [];
    }
}

/**
 * Renderizar categorías en el dropdown del menú
 */
function renderCategoriesDropdown(categories) {
    const dropdown = document.getElementById('categories-dropdown');
    
    if (!dropdown) {
        console.warn('Dropdown container no encontrado');
        return;
    }

    if (!categories || categories.length === 0) {
        dropdown.innerHTML = '<a href="#" class="dropdown-item" style="pointer-events: none;">No hay categorías disponibles</a>';
        return;
    }

    dropdown.innerHTML = categories.map(cat => `
        <a href="categories/category.html?genre=${encodeURIComponent(cat.name.toLowerCase())}&id=${cat.id}" class="dropdown-item">
            ${cat.name}
        </a>
    `).join('');
}

/**
 * Renderizar categorías como botones en la sección de géneros
 */
function renderGenreButtons(categories) {
    const container = document.getElementById('genres-grid-container');
    
    if (!container) {
        console.warn('Genres grid container no encontrado');
        return;
    }

    if (!categories || categories.length === 0) {
        container.innerHTML = '<button class="genre-btn" disabled>No hay géneros disponibles</button>';
        return;
    }

    container.innerHTML = categories.map(cat => `
        <button class="genre-btn" onclick="navigateToCategory('${cat.name.toLowerCase()}', ${cat.id})">
            ${cat.name}
        </button>
    `).join('');
}

/**
 * Navegar a una categoría específica
 */
function navigateToCategory(genreName, categoryId) {
    showLoadingMessage(`Cargando ${genreName}...`);
    setTimeout(() => {
        window.location.href = `categories/category.html?genre=${encodeURIComponent(genreName)}&id=${categoryId}`;
        hideLoadingMessage();
    }, 500);
}

/**
 * Inicializar categorías dinámicas
 */
async function initializeCategoriesSystem() {
    console.log('Cargando categorías desde el backend...');
    
    const categories = await loadCategoriesFromBackend();
    
    if (categories && categories.length > 0) {
        console.log(`${categories.length} categorías cargadas exitosamente`);
        renderCategoriesDropdown(categories);
        renderGenreButtons(categories);
    } else {
        console.warn('No se pudieron cargar las categorías, usando valores por defecto');
        // Fallback a categorías hardcodeadas si falla la carga
        useFallbackCategories();
    }
}

/**
 * Fallback: usar categorías hardcodeadas si falla la conexión al backend
 */
function useFallbackCategories() {
    const fallbackCategories = [
        { id: 1, name: 'Fantasy' },
        { id: 2, name: 'Romance' },
        { id: 3, name: 'Mystery' },
        { id: 4, name: 'Sci-Fi' },
        { id: 5, name: 'Horror' },
        { id: 6, name: 'Adventure' },
        { id: 7, name: 'Drama' },
        { id: 8, name: 'Comedy' },
        { id: 9, name: 'Historical' },
        { id: 10, name: 'Thriller' }
    ];

    console.log('Usando categorías por defecto (fallback)');
    renderCategoriesDropdown(fallbackCategories);
    renderGenreButtons(fallbackCategories);
}

// ======================================== 
// INITIALIZATION
// ======================================== 

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupSearchFunctionality();
    setupNavigationHandlers();
    setupSmoothScrolling();
    setupStoryInteractions();
    
    // NUEVO: Cargar categorías dinámicamente
    initializeCategoriesSystem();
    
    console.log('WriteTogether app initialized successfully!');
}

// ======================================== 
// SEARCH FUNCTIONALITY
// ======================================== 

// Search functionality
function setupSearchFunctionality() {
    const searchBar = document.getElementById('searchBar');
    
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterStories(searchTerm);
        });

        // Add search suggestions functionality
        searchBar.addEventListener('focus', function() {
            this.placeholder = 'Buscar por título, autor o género...';
        });

        searchBar.addEventListener('blur', function() {
            this.placeholder = 'Buscar historias...';
        });
    }
}

// Filter stories based on search term
function filterStories(searchTerm) {
    const storyCards = document.querySelectorAll('.story-card');
    let visibleCount = 0;

    storyCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('.story-meta div:first-child').textContent.toLowerCase();
        const category = card.querySelector('.story-meta div:nth-child(2)').textContent.toLowerCase();

        const isMatch = title.includes(searchTerm) || 
                       author.includes(searchTerm) || 
                       category.includes(searchTerm);

        if (isMatch || searchTerm === '') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show message if no results found
    updateSearchResults(visibleCount, searchTerm);
}

// Update search results message
function updateSearchResults(count, searchTerm) {
    let messageContainer = document.getElementById('search-message');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'search-message';
        messageContainer.style.textAlign = 'center';
        messageContainer.style.padding = '20px';
        messageContainer.style.fontSize = '1.1em';
        messageContainer.style.color = '#E67E22';
        
        const storiesSection = document.querySelector('.stories-section');
        storiesSection.appendChild(messageContainer);
    }

    if (searchTerm && count === 0) {
        messageContainer.textContent = `No se encontraron historias para "${searchTerm}"`;
        messageContainer.style.display = 'block';
    } else if (searchTerm && count > 0) {
        messageContainer.textContent = `Se encontraron ${count} historias para "${searchTerm}"`;
        messageContainer.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    } else {
        messageContainer.style.display = 'none';
    }
}

// Enhanced search with debounce
function setupEnhancedSearch() {
    const searchBar = document.getElementById('searchBar');
    
    if (searchBar) {
        const debouncedSearch = debounce((searchTerm) => {
            filterStories(searchTerm);
        }, 300);

        searchBar.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            debouncedSearch(searchTerm);
        });
    }
}

// ======================================== 
// STORY INTERACTIONS
// ======================================== 

// Story interaction functions
function setupStoryInteractions() {
    const storyCards = document.querySelectorAll('.story-card');

    storyCards.forEach((card, index) => {
        // Add hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const storyId = index + 1;
                openStory(storyId);
            }
        });
    });
}

// Open story function
function openStory(storyId) {
    // En desarrollo, redirigir a la página de categoría
    window.location.href = `categories/category.html?genre=all&story=${storyId}`;
}

// ======================================== 
// GENRE FILTERING
// ======================================== 

// Función mejorada para filtrar por género
function filterByGenre(genre) {
    window.location.href = `categories/category.html?genre=${genre}`;
}

// Genre button interactions
function setupGenreButtons() {
    const genreButtons = document.querySelectorAll('.genre-btn');

    genreButtons.forEach(button => {
        // Add keyboard navigation
        button.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add focus styles
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid #E67E22';
            this.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// ======================================== 
// NAVIGATION
// ======================================== 

// Navigation handlers
function setupNavigationHandlers() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            handleNavigation(href, this);
        });
    });
}

// Handle navigation clicks
function handleNavigation(href, button) {
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);

    switch(href) {
        case '#create-story':
            navigateToCreateStory();
            break;
        case '#login':
            navigateToLogin();
            break;
        case '#signup':
            navigateToSignup();
            break;
        default:
            console.log(`Navigation to ${href} not implemented yet.`);
    }
}

// Navigation functions
function navigateToCreateStory() {
    showLoadingMessage('Preparando el editor de historias...');
    setTimeout(() => {
        alert('Navegando a la página de creación de historia...');
        hideLoadingMessage();
        // window.location.href = 'create-story.html';
    }, 1000);
}

function navigateToLogin() {
    showLoadingMessage('Cargando página de inicio de sesión...');
    setTimeout(() => {
        alert('Navegando a la página de login...');
        hideLoadingMessage();
        // window.location.href = 'login.html';
    }, 800);
}

function navigateToSignup() {
    showLoadingMessage('Cargando formulario de registro...');
    setTimeout(() => {
        alert('Navegando a la página de registro...');
        hideLoadingMessage();
        // window.location.href = 'signup.html';
    }, 800);
}

// ======================================== 
// LOADING MESSAGES
// ======================================== 

// Loading message functions
function showLoadingMessage(message) {
    let loadingDiv = document.getElementById('loading-message');
    
    if (!loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(51, 51, 51, 0.95);
            color: #E67E22;
            padding: 20px 40px;
            border-radius: 10px;
            border: 2px solid #E67E22;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(loadingDiv);
    }
    
    loadingDiv.textContent = message;
    loadingDiv.style.display = 'block';
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loading-message');
    
    if (loadingDiv) {
        loadingDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            loadingDiv.style.display = 'none';
        }, 300);
    }
}

// ======================================== 
// SMOOTH SCROLLING
// ======================================== 

// Smooth scrolling setup
function setupSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a navigation button (handled separately)
            if (href === '#create-story' || href === '#login' || href === '#signup') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ======================================== 
// UTILITY FUNCTIONS
// ======================================== 

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage functions for future use
function saveToLocalStorage(key, data) {
    try {
        // Note: localStorage is not available in Claude artifacts
        // This is a placeholder for when code is used in a real environment
        console.log(`Would save to localStorage: ${key}`, data);
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        // Note: localStorage is not available in Claude artifacts
        // This is a placeholder for when code is used in a real environment
        console.log(`Would retrieve from localStorage: ${key}`);
        return null;
    } catch (error) {
        console.warn('Could not retrieve from localStorage:', error);
        return null;
    }
}

// ======================================== 
// STORY MANAGER CLASS
// ======================================== 

// Story data management (for future backend integration)
class StoryManager {
    constructor() {
        this.stories = this.loadStories();
    }

    loadStories() {
        // In a real app, this would fetch from an API
        return [
            {
                id: 1,
                title: "The Enchanted Forest",
                author: "Maria Garcia",
                category: "Fantasy",
                rating: 5,
                date: "15/03/2024",
                image: "📖"
            },
            {
                id: 2,
                title: "Love in Paris",
                author: "Jean Baptiste",
                category: "Romance",
                rating: 4,
                date: "22/03/2024",
                image: "📚"
            },
            {
                id: 3,
                title: "The Missing Key",
                author: "Detective Smith",
                category: "Mystery",
                rating: 5,
                date: "28/03/2024",
                image: "📝"
            },
            {
                id: 4,
                title: "Space Odyssey 2025",
                author: "Sci-Fi Writer",
                category: "Sci-Fi",
                rating: 3,
                date: "05/04/2024",
                image: "📖"
            },
            {
                id: 5,
                title: "The Haunted Manor",
                author: "Horror Master",
                category: "Horror",
                rating: 4,
                date: "12/04/2024",
                image: "📚"
            },
            {
                id: 6,
                title: "Mountain Adventure",
                author: "Adventure Seeker",
                category: "Adventure",
                rating: 5,
                date: "19/04/2024",
                image: "📝"
            },
            {
                id: 7,
                title: "Family Drama",
                author: "Life Writer",
                category: "Drama",
                rating: 3,
                date: "26/04/2024",
                image: "📖"
            },
            {
                id: 8,
                title: "Comedy Night",
                author: "Funny Person",
                category: "Comedy",
                rating: 4,
                date: "03/05/2024",
                image: "📚"
            }
        ];
    }

    getStoryById(id) {
        return this.stories.find(story => story.id === parseInt(id));
    }

    getStoriesByGenre(genre) {
        return this.stories.filter(story => 
            story.category.toLowerCase() === genre.toLowerCase()
        );
    }

    searchStories(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.stories.filter(story =>
            story.title.toLowerCase().includes(term) ||
            story.author.toLowerCase().includes(term) ||
            story.category.toLowerCase().includes(term)
        );
    }
}

// Initialize story manager
const storyManager = new StoryManager();

// ======================================== 
// AI ASSISTANT CLASS
// ======================================== 

// API placeholder functions for future AI integration
class AIAssistant {
    constructor() {
        this.apiKey = null; // Will be set when integrating real APIs
        this.baseURL = null;
    }

    async generateStoryContinuation(storyText, style = 'neutral') {
        // Placeholder for OpenAI GPT API integration
        console.log('AI Story Continuation requested for:', storyText.substring(0, 50) + '...');
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    continuation: "Esta sería la continuación generada por IA...",
                    suggestions: [
                        "Sugerencia 1 de continuación",
                        "Sugerencia 2 de continuación",
                        "Sugerencia 3 de continuación"
                    ]
                });
            }, 1500);
        });
    }

    async analyzeStoryCoherence(storyText) {
        // Placeholder for story analysis
        console.log('AI Coherence Analysis requested');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    coherenceScore: 8.5,
                    suggestions: [
                        "El personaje principal podría tener más desarrollo",
                        "La transición entre capítulos necesita mejorarse",
                        "El diálogo es natural y fluido"
                    ],
                    grammarIssues: []
                });
            }, 1000);
        });
    }

    async generateWritingPrompts(genre = 'any') {
        // Placeholder for writing prompt generation
        console.log('AI Writing Prompts requested for genre:', genre);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const prompts = {
                    fantasy: [
                        "Un mago que ha perdido su magia debe salvar su reino",
                        "Dragones que solo pueden ser vistos por niños aparecen en la ciudad",
                        "Un libro mágico que cambia su historia cada vez que se lee"
                    ],
                    romance: [
                        "Dos rivales de negocios quedan atrapados en un elevador",
                        "Una carta de amor del pasado llega 50 años tarde",
                        "Encuentro casual en una librería durante una tormenta"
                    ],
                    mystery: [
                        "Un detective que resuelve crímenes en sus sueños",
                        "Desaparece toda una familia, pero nadie recuerda que existían",
                        "Un asesino que deja pistas en forma de origami"
                    ]
                };

                resolve({
                    prompts: prompts[genre] || prompts.fantasy,
                    genre: genre
                });
            }, 800);
        });
    }
}

// Initialize AI assistant
const aiAssistant = new AIAssistant();

// ======================================== 
// AI FEATURES
// ======================================== 

// Event listeners for future AI integration
function setupAIFeatures() {
    // This will be expanded when integrating real AI APIs
    const aiSection = document.querySelector('.ai-section');
    
    if (aiSection) {
        aiSection.addEventListener('click', function() {
            alert('AI features will be available soon! Integration with OpenAI, Google Gemini, and Claude APIs coming in next update.');
        });
    }
}

// ======================================== 
// PERFORMANCE MONITORING
// ======================================== 

// Performance monitoring
function setupPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });

    // Monitor search performance
    const originalFilterStories = filterStories;
    window.filterStories = function(searchTerm) {
        const start = performance.now();
        originalFilterStories(searchTerm);
        const end = performance.now();
        console.log(`Search completed in ${Math.round(end - start)}ms`);
    };
}

// ======================================== 
// ERROR HANDLING
// ======================================== 

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #E67E22;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1001;
        animation: fadeIn 0.3s ease;
    `;
    errorMessage.textContent = 'Ocurrió un error. Por favor, recarga la página.';
    document.body.appendChild(errorMessage);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 5000);
});

// ======================================== 
// FINAL INITIALIZATION
// ======================================== 

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupGenreButtons();
    setupEnhancedSearch();
    setupAIFeatures();
    setupPerformanceMonitoring();
    
    console.log('WriteTogether fully initialized with dynamic categories!');
});

// ======================================== 
// MODULE EXPORTS
// ======================================== 

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StoryManager,
        AIAssistant,
        filterStories,
        openStory,
        filterByGenre,
        loadCategoriesFromBackend,
        navigateToCategory
    };
}