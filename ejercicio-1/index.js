
const DOMElements = {
    navbarButtons: document.querySelectorAll('.nav-buttons button'),
    charactersGrid: document.getElementById('charactersGrid'),
    loadingMessage: document.getElementById('loadingMessage'),
    errorMessage: document.getElementById('errorMessage'),
    noCharactersMessage: document.getElementById('noCharactersMessage'),
    btnAll: document.getElementById('btnAll'),
    btnAlive: document.getElementById('btnAlive'),
    btnDead: document.getElementById('btnDead'),
    btnFavorites: document.getElementById('btnFavorites')
};

const API_BASE_URL = 'https://rickandmortyapi.com/api/character/';
const LOCAL_STORAGE_FAVORITES_KEY = 'rmFavorites';
const LOCAL_STORAGE_LAST_SECTION_KEY = 'rmLastSection';

let favoriteCharacters = [];
let currentSection = 'all'; // 'all', 'alive', 'dead', 'favorites'

/**
 * Muestra un mensaje con SweetAlert2.
 * @param {string} title 
 * @param {string} text 
 * @param {string} icon 
 * @param {object} [options={}] 
 */
const showAlert = (title, text, icon, options = {}) => {
    Swal.fire({
        title,
        text,
        icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#34495e',
        color: '#ecf0f1',
        ...options
    });
};

/**
 * Carga los personajes favoritos desde Local Storage.
 */
const loadFavorites = () => {
    try {
        const storedFavorites = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
        favoriteCharacters = storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Error al cargar favoritos desde Local Storage:", error);
        favoriteCharacters = []; 
        showAlert('Error', 'Problema al cargar tus favoritos.', 'error', { timer: 0, showConfirmButton: true });
    }
};

/**
 * Guarda los personajes favoritos en Local Storage.
 */
const saveFavorites = () => {
    localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favoriteCharacters));
};

/** 
 * @param {string} type - 'loading', 'error', 'noCharacters' o 'none'.
 */
const toggleMessages = (type) => {
    DOMElements.loadingMessage.classList.toggle('hidden', type !== 'loading');
    DOMElements.errorMessage.classList.toggle('hidden', type !== 'error');
    DOMElements.noCharactersMessage.classList.toggle('hidden', type !== 'noCharacters');
    DOMElements.charactersGrid.classList.toggle('hidden', type !== 'none' && type !== 'characters');
};

/**
 * 
 * @param {Array<object>} characters - Array de objetos personaje.
 * @param {HTMLElement} container - El contenedor donde se renderizarán las tarjetas.
 */
const renderCharacters = (characters, container) => {
    container.innerHTML = ''; 
    if (characters.length === 0) {
        toggleMessages('noCharacters');
        return;
    }
    toggleMessages('characters'); 

    const fragment = document.createDocumentFragment();
    characters.forEach(character => {
        const isFavorite = favoriteCharacters.some(fav => fav.id === character.id);
        const card = document.createElement('div');
        card.classList.add('character-card');
        card.dataset.id = character.id; 

        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <div class="character-info">
                <h3>${character.name}</h3>
                <p><strong>Estado:</strong> ${character.status}</p>
                <p><strong>Especie:</strong> ${character.species}</p>
                <button class="favorite-toggle-btn ${isFavorite ? 'is-favorite' : ''}"
                        data-action="${isFavorite ? 'remove' : 'add'}">
                    ${isFavorite ? '❌ Quitar de favoritos' : '❤️ Agregar a favoritos'}
                </button>
            </div>
        `;
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
};

/**
 * 
 * @param {object} characterData - Datos del personaje (id, name, image, status, species).
 * @param {string} action - 'add' o 'remove'.
 */
const toggleFavorite = (characterData, action) => {
    const existingIndex = favoriteCharacters.findIndex(fav => fav.id === characterData.id);

    if (action === 'add') {
        if (existingIndex === -1) {
            favoriteCharacters.push(characterData);
            saveFavorites();
            showAlert('¡Agregado!', `${characterData.name} añadido a favoritos.`, 'success');
        } else {
            showAlert('¡Ya es favorito!', `${characterData.name} ya está en tu lista.`, 'warning');
        }
    } else if (action === 'remove') {
        if (existingIndex !== -1) {
            favoriteCharacters.splice(existingIndex, 1);
            saveFavorites();
            showAlert('¡Eliminado!', `${characterData.name} quitado de favoritos.`, 'info');
        }
    }
    if (currentSection === 'favorites') {
        renderCharacters(favoriteCharacters, DOMElements.charactersGrid);
    } else {
        const cardButton = document.querySelector(`.character-card[data-id="${characterData.id}"] .favorite-toggle-btn`);
        if (cardButton) {
            const isFavorite = action === 'add'; 
            cardButton.classList.toggle('is-favorite', isFavorite);
            cardButton.dataset.action = isFavorite ? 'remove' : 'add';
            cardButton.textContent = isFavorite ? '❌ Quitar de favoritos' : '❤️ Agregar a favoritos';
        }
    }
};

/**
 * @param {string} status - 'alive', 'dead' o ''.
 */
const fetchCharacters = async (status = '') => {
    toggleMessages('loading');
    DOMElements.charactersGrid.innerHTML = ''; 

    let url = API_BASE_URL;
    if (status) {
        url += `?status=${status}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        renderCharacters(data.results || [], DOMElements.charactersGrid);
    } catch (error) {
        console.error("Error al cargar personajes:", error);
        toggleMessages('error');
    }
};

/**
 * Maneja el cambio de sección de la aplicación.
 * @param {string} section - La sección a la que se desea cambiar.
 */
const handleSectionChange = (section) => {
    currentSection = section;
    localStorage.setItem(LOCAL_STORAGE_LAST_SECTION_KEY, section);

    DOMElements.navbarButtons.forEach(button => button.classList.remove('active'));
    let activeBtn;
    if (section === 'all') activeBtn = DOMElements.btnAll;
    else if (section === 'alive') activeBtn = DOMElements.btnAlive;
    else if (section === 'dead') activeBtn = DOMElements.btnDead;
    else if (section === 'favorites') activeBtn = DOMElements.btnFavorites;
    activeBtn.classList.add('active');

    if (section === 'favorites') {
        renderCharacters(favoriteCharacters, DOMElements.charactersGrid);
    } else {
        fetchCharacters(DOMElements[`btn${section.charAt(0).toUpperCase() + section.slice(1)}`]?.dataset.status || '');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites(); // Carga los favoritos al inicio

    const lastSection = localStorage.getItem(LOCAL_STORAGE_LAST_SECTION_KEY) || 'all';
    handleSectionChange(lastSection);

    DOMElements.navbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.dataset.status;
            if (button.id === 'btnFavorites') {
                handleSectionChange('favorites');
            } else if (status === 'alive') {
                handleSectionChange('alive');
            } else if (status === 'dead') {
                handleSectionChange('dead');
            } else { // Si no tiene status o es btnAll
                handleSectionChange('all');
            }
        });
    });
    DOMElements.charactersGrid.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('favorite-toggle-btn')) {
            const card = target.closest('.character-card');
            const characterId = parseInt(card.dataset.id); // Convertir a número

            let characterData = favoriteCharacters.find(fav => fav.id === characterId);

            if (!characterData && currentSection !== 'favorites') {
                characterData = {
                    id: characterId,
                    name: card.querySelector('h3').textContent,
                    image: card.querySelector('img').src,
                    status: card.querySelector('p:nth-of-type(1)').textContent.replace('Estado: ', '').trim(),
                    species: card.querySelector('p:nth-of-type(2)').textContent.replace('Especie: ', '').trim()
                };
            }

            if (characterData) { 
                 toggleFavorite(characterData, target.dataset.action);
            }
        }
    });
});