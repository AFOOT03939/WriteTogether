class CategoryPage {
    constructor() {
        this.currentGenre = '';
        this.currentCategoryId = null;
        this.currentPage = 1;
        this.storiesPerPage = 12;
        this.allStories = [];
        this.filteredStories = [];
        this.API_BASE_URL = '/Category';
        this.STORIES_API_URL = '/Stories';
        
        this.init();
    }
    
    async init() {
        this.getCurrentGenre();
        this.setupEventListeners();
        await this.loadCategoriesForDropdown();
        await this.loadStories();
        this.updateCategoryInfo();
    }
    
    getCurrentGenre() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentGenre = urlParams.get('genre') || 'all';
        this.currentCategoryId = urlParams.get('id') || null;
        console.log('Current genre:', this.currentGenre, 'ID:', this.currentCategoryId);
    }
    
    setupEventListeners() {
        // Sort and filter controls
        document.getElementById('sortBy')?.addEventListener('change', (e) => {
            this.sortStories(e.target.value);
            this.renderStories();
        });
        
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filterByStatus(e.target.value);
            this.renderStories();
        });
        
        // Search functionality
        document.getElementById('searchBar')?.addEventListener('input', (e) => {
            this.searchStories(e.target.value);
            this.renderStories();
        });
    }
    
    // ==================== BACKEND INTEGRATION ====================
    
    async loadCategoriesForDropdown() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/GetAll`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.renderCategoriesDropdown(result.data);
            } else {
                console.error('Error al cargar categorías:', result.message);
                this.useFallbackDropdown();
            }
        } catch (error) {
            console.error('Error de conexión al cargar categorías:', error);
            this.useFallbackDropdown();
        }
    }
    
    renderCategoriesDropdown(categories) {
        const dropdown = document.getElementById('categories-dropdown-category');
        
        if (!dropdown) return;

        if (!categories || categories.length === 0) {
            dropdown.innerHTML = '<a href="#" class="dropdown-item" style="pointer-events: none;">No hay categorías disponibles</a>';
            return;
        }

        dropdown.innerHTML = categories.map(cat => `
            <a href="category.html?genre=${encodeURIComponent(cat.name.toLowerCase())}&id=${cat.id}" class="dropdown-item">
                ${cat.name}
            </a>
        `).join('');
    }
    
    useFallbackDropdown() {
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
        
        this.renderCategoriesDropdown(fallbackCategories);
    }
    
    async loadStoriesFromBackend() {
        try {
            if (!this.currentCategoryId) {
                console.log('No category ID, usando mock stories');
                return [];
            }

            const response = await fetch(`${this.STORIES_API_URL}/GetByCategory?categoryId=${this.currentCategoryId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                return result.data || [];
            } else {
                console.error('Error al cargar historias:', result.message);
                return [];
            }
        } catch (error) {
            console.error('Error de conexión al cargar historias:', error);
            return [];
        }
    }
    
    async loadStories() {
        try {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('storiesGrid').style.display = 'none';
            document.getElementById('noStories').style.display = 'none';
            
            // Intentar cargar desde el backend primero
            let storiesFromBackend = [];
            if (this.currentCategoryId) {
                storiesFromBackend = await this.loadStoriesFromBackend();
            }
            
            // Si hay historias del backend, usarlas; si no, usar mock
            if (storiesFromBackend.length > 0) {
                this.allStories = this.transformBackendStories(storiesFromBackend);
            } else {
                console.log('Usando historias mock');
                this.allStories = this.generateMockStories();
            }
            
            this.filteredStories = [...this.allStories];
            
            document.getElementById('loading').style.display = 'none';
            
            if (this.filteredStories.length > 0) {
                document.getElementById('storiesGrid').style.display = 'grid';
                this.renderStories();
                this.updateStats();
            } else {
                document.getElementById('noStories').style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error loading stories:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('noStories').style.display = 'block';
        }
    }
    
    // Transformar datos del backend al formato esperado
    transformBackendStories(backendStories) {
        return backendStories.map(story => ({
            id: story.id,
            title: story.title || 'Sin título',
            author: story.authorName || story.userName || 'Autor desconocido',
            genre: this.currentGenre,
            rating: story.rating || 0,
            status: story.status || 'ongoing',
            date: story.createdDate ? new Date(story.createdDate) : new Date(),
            description: story.description || 'Sin descripción disponible',
            chapters: story.chapterCount || 0,
            views: story.viewCount || 0,
            likes: story.likeCount || 0,
            coverImage: story.coverImageUrl || null
        }));
    }
    
    // ==================== UI UPDATE METHODS ====================
    
    updateCategoryInfo() {
        const categoryNames = {
            fantasy: 'Fantasía',
            romance: 'Romance',
            mystery: 'Misterio',
            'sci-fi': 'Ciencia Ficción',
            scifi: 'Ciencia Ficción',
            horror: 'Terror',
            adventure: 'Aventura',
            drama: 'Drama',
            comedy: 'Comedia',
            historical: 'Histórico',
            thriller: 'Thriller',
            all: 'Todas las Categorías'
        };
        
        const categoryDescriptions = {
            fantasy: 'Mundos mágicos, criaturas fantásticas y aventuras épicas te esperan',
            romance: 'Historias de amor que tocan el corazón y despiertan emociones',
            mystery: 'Enigmas por resolver y secretos que descubrir',
            'sci-fi': 'El futuro, la tecnología y mundos por explorar',
            scifi: 'El futuro, la tecnología y mundos por explorar',
            horror: 'Historias que te mantendrán despierto por las noches',
            adventure: 'Emocionantes viajes y experiencias inolvidables',
            drama: 'Historias profundas que exploran la condición humana',
            comedy: 'Risas, diversión y momentos alegres',
            historical: 'Viaja al pasado y descubre otras épocas',
            thriller: 'Tensión, suspenso y adrenalina pura',
            all: 'Descubre increíbles historias de todas las categorías'
        };
        
        const title = categoryNames[this.currentGenre] || categoryNames['all'];
        const description = categoryDescriptions[this.currentGenre] || categoryDescriptions['all'];
        
        const titleElement = document.getElementById('categoryTitle');
        const descElement = document.getElementById('categoryDescription');
        
        if (titleElement) titleElement.textContent = title;
        if (descElement) descElement.textContent = description;
        document.title = `${title} - WriteTogether`;
    }
    
    // ==================== MOCK DATA (FALLBACK) ====================
    
    generateMockStories() {
        const stories = [];
        const authors = ['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Pérez', 'Sofia Martinez', 'Diego Silva'];
        const statuses = ['completed', 'ongoing', 'paused'];
        const ratings = [3, 4, 5];
        
        for (let i = 1; i <= 50; i++) {
            const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
            const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            
            stories.push({
                id: i,
                title: `Historia ${i} - ${this.currentGenre}`,
                author: randomAuthor,
                genre: this.currentGenre,
                rating: randomRating,
                status: randomStatus,
                date: randomDate,
                description: `Una increíble historia de ${this.currentGenre} que te mantendrá enganchado desde la primera línea.`,
                chapters: Math.floor(Math.random() * 50) + 1,
                views: Math.floor(Math.random() * 10000) + 100,
                likes: Math.floor(Math.random() * 1000) + 10,
                coverImage: null
            });
        }
        
        return stories;
    }
    
    // ==================== FILTERING & SORTING ====================
    
    sortStories(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredStories.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredStories.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'rating':
                this.filteredStories.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                this.filteredStories.sort((a, b) => b.views - a.views);
                break;
        }
    }
    
    filterByStatus(status) {
        if (status === 'all') {
            this.filteredStories = [...this.allStories];
        } else {
            this.filteredStories = this.allStories.filter(story => story.status === status);
        }
    }
    
    searchStories(query) {
        if (!query.trim()) {
            this.filteredStories = [...this.allStories];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredStories = this.allStories.filter(story =>
                story.title.toLowerCase().includes(searchTerm) ||
                story.author.toLowerCase().includes(searchTerm) ||
                story.description.toLowerCase().includes(searchTerm)
            );
        }
    }
    
    // ==================== RENDERING ====================
    
    renderStories() {
        const storiesGrid = document.getElementById('storiesGrid');
        if (!storiesGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.storiesPerPage;
        const endIndex = startIndex + this.storiesPerPage;
        const storiesToShow = this.filteredStories.slice(startIndex, endIndex);
        
        if (storiesToShow.length === 0 && this.filteredStories.length > 0) {
            this.currentPage = 1;
            this.renderStories();
            return;
        }
        
        storiesGrid.innerHTML = storiesToShow.map(story => this.createStoryCard(story)).join('');
        this.renderPagination();
        
        // Add click event listeners to story cards
        document.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const storyId = e.currentTarget.dataset.storyId;
                this.openStory(storyId);
            });
        });
    }
    
    createStoryCard(story) {
        const statusClass = `status-${story.status}`;
        const statusText = {
            completed: 'Completada',
            ongoing: 'En progreso',
            paused: 'Pausada'
        };
        
        const stars = '★'.repeat(Math.max(0, Math.min(5, story.rating))) + '☆'.repeat(Math.max(0, 5 - story.rating));
        
        const imageSection = story.coverImage 
            ? `<img src="${story.coverImage}" alt="${story.title}" class="story-cover-image">`
            : '<div class="story-image">📚</div>';
        
        return `
            <div class="story-card" data-story-id="${story.id}">
                ${imageSection}
                <div class="story-info">
                    <h3>${story.title}</h3>
                    <div class="story-rating">${stars}</div>
                    <div class="story-meta">
                        <div><strong>Autor:</strong> ${story.author}</div>
                        <div><strong>Capítulos:</strong> ${story.chapters}</div>
                        <div><strong>Vistas:</strong> ${story.views.toLocaleString()}</div>
                        <div><strong>Fecha:</strong> ${story.date.toLocaleDateString()}</div>
                    </div>
                    <div class="story-status ${statusClass}">${statusText[story.status] || 'Desconocido'}</div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredStories.length / this.storiesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="categoryPage.changePage(${this.currentPage - 1})">
                ← Anterior
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button onclick="categoryPage.changePage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" onclick="categoryPage.changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="categoryPage.changePage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="categoryPage.changePage(${this.currentPage + 1})">
                Siguiente →
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    changePage(page) {
        this.currentPage = page;
        this.renderStories();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updateStats() {
        const uniqueAuthors = [...new Set(this.filteredStories.map(story => story.author))].length;
        const storyCountElement = document.getElementById('storyCount');
        const authorCountElement = document.getElementById('authorCount');
        
        if (storyCountElement) {
            storyCountElement.textContent = `${this.filteredStories.length} historias`;
        }
        if (authorCountElement) {
            authorCountElement.textContent = `${uniqueAuthors} autores`;
        }
    }
    
    openStory(storyId) {
        // Redirigir a la página de la historia
        window.location.href = `/story.html?id=${storyId}`;
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    window.categoryPage = new CategoryPage();
});

// Funciones globales para compatibilidad
function openStory(storyId) {
    window.categoryPage?.openStory(storyId);
}   