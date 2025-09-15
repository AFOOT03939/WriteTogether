class CategoryPage {
    constructor() {
        this.currentGenre = '';
        this.currentPage = 1;
        this.storiesPerPage = 12;
        this.allStories = [];
        this.filteredStories = [];
        
        this.init();
    }
    
    init() {
        this.getCurrentGenre();
        this.setupEventListeners();
        this.loadStories();
        this.updateCategoryInfo();
    }
    
    getCurrentGenre() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentGenre = urlParams.get('genre') || 'all';
        console.log('Current genre:', this.currentGenre);
    }
    
    setupEventListeners() {
        // Sort and filter controls
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.sortStories(e.target.value);
            this.renderStories();
        });
        
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterByStatus(e.target.value);
            this.renderStories();
        });
        
        // Search functionality
        document.getElementById('searchBar').addEventListener('input', (e) => {
            this.searchStories(e.target.value);
            this.renderStories();
        });
    }
    
    updateCategoryInfo() {
        const categoryNames = {
            fantasy: 'Fantasía',
            romance: 'Romance',
            mystery: 'Misterio',
            scifi: 'Ciencia Ficción',
            horror: 'Terror',
            adventure: 'Aventura',
            drama: 'Drama',
            comedy: 'Comedia',
            historical: 'Histórico',
            thriller: 'Thriller'
        };
        
        const categoryDescriptions = {
            fantasy: 'Mundos mágicos, criaturas fantásticas y aventuras épicas te esperan',
            romance: 'Historias de amor que tocan el corazón y despiertan emociones',
            mystery: 'Enigmas por resolver y secretos que descubrir',
            scifi: 'El futuro, la tecnología y mundos por explorar',
            horror: 'Historias que te mantendrán despierto por las noches',
            adventure: 'Emocionantes viajes y experiencias inolvidables',
            drama: 'Historias profundas que exploran la condición humana',
            comedy: 'Risas, diversión y momentos alegres',
            historical: 'Viaja al pasado y descubre otras épocas',
            thriller: 'Tensión, suspenso y adrenalina pura'
        };
        
        const title = categoryNames[this.currentGenre] || 'Todas las Categorías';
        const description = categoryDescriptions[this.currentGenre] || 'Descubre increíbles historias de todas las categorías';
        
        document.getElementById('categoryTitle').textContent = title;
        document.getElementById('categoryDescription').textContent = description;
        document.title = `${title} - WriteTogether`;
    }
    
    // Simulación de datos - En producción, esto vendría de tu API/base de datos
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
                likes: Math.floor(Math.random() * 1000) + 10
            });
        }
        
        return stories;
    }
    
    async loadStories() {
        try {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('storiesGrid').style.display = 'none';
            document.getElementById('noStories').style.display = 'none';
            
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // En producción, aquí harías la llamada real a tu API
            // const response = await fetch(`/api/stories?genre=${this.currentGenre}`);
            // this.allStories = await response.json();
            
            this.allStories = this.generateMockStories();
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
    
    renderStories() {
        const storiesGrid = document.getElementById('storiesGrid');
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
        
        const stars = '★'.repeat(story.rating) + '☆'.repeat(5 - story.rating);
        
        return `
            <div class="story-card" data-story-id="${story.id}">
                <div class="story-image">📚</div>
                <div class="story-info">
                    <h3>${story.title}</h3>
                    <div class="story-rating">${stars}</div>
                    <div class="story-meta">
                        <div><strong>Autor:</strong> ${story.author}</div>
                        <div><strong>Capítulos:</strong> ${story.chapters}</div>
                        <div><strong>Vistas:</strong> ${story.views.toLocaleString()}</div>
                        <div><strong>Fecha:</strong> ${story.date.toLocaleDateString()}</div>
                    </div>
                    <div class="story-status ${statusClass}">${statusText[story.status]}</div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredStories.length / this.storiesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
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
        document.getElementById('storyCount').textContent = `${this.filteredStories.length} historias`;
        document.getElementById('authorCount').textContent = `${uniqueAuthors} autores`;
    }
    
    openStory(storyId) {
        // Aquí redirigirías a la página de la historia específica
        console.log('Opening story:', storyId);
        // En producción:
        // window.location.href = `/story/${storyId}`;
        alert(`Abriendo historia ID: ${storyId}\n(En desarrollo - aquí se abriría la historia completa)`);
    }
}

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.categoryPage = new CategoryPage();
});

// Funciones globales para compatibilidad
function openStory(storyId) {
    window.categoryPage.openStory(storyId);
}

// API simulation - En producción, estas funciones se conectarían a tu backend
class StoryAPI {
    static async getStoriesByGenre(genre, page = 1, limit = 12) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // En producción, esto sería una llamada real a tu API
        // return fetch(`/api/stories?genre=${genre}&page=${page}&limit=${limit}`)
        //     .then(response => response.json());
        
        return {
            stories: window.categoryPage.generateMockStories(),
            totalCount: 50,
            currentPage: page,
            totalPages: Math.ceil(50 / limit)
        };
    }
    
    static async searchStories(query, genre = null) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // En producción:
        // return fetch(`/api/stories/search?q=${query}&genre=${genre}`)
        //     .then(response => response.json());
        
        return window.categoryPage.allStories.filter(story =>
            story.title.toLowerCase().includes(query.toLowerCase()) ||
            story.author.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    static async getStoryById(storyId) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // En producción:
        // return fetch(`/api/stories/${storyId}`)
        //     .then(response => response.json());
        
        return window.categoryPage.allStories.find(story => story.id === parseInt(storyId));
    }
}