const apiKey = 'AIzaSyAL1rNirCOTwC5znh-Zg-5TwCeYPC8u1hY'; // api do youtube v3

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const videosContainer = document.getElementById('videos-section');
const favoritesContainer = document.getElementById('favorites-section');
const favoritesButton = document.getElementById('favorites-button');
const favoritesCount = document.querySelector('#favorites-button span');
const loadMoreButton = document.getElementById('load-more');

let nextPageToken = '';
let currentSearchTerm = '';
let favorites = [];

// Chamar fetchVideos quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    currentSearchTerm = 'programação'; // Termo de busca inicial
    await fetchVideos(currentSearchTerm);
});

// Evento de busca ao clicar no botão
searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') return;

    currentSearchTerm = searchTerm;
    clearVideoContainers();
    await fetchVideos(searchTerm);
    searchInput.value = ''; // Limpar a barra de busca após a busca
});

// Evento de carregar mais vídeos
loadMoreButton.addEventListener('click', async () => {
    await fetchVideos(currentSearchTerm, nextPageToken);
});

// Evento ao clicar no botão de favoritos
favoritesButton.addEventListener('click', () => {
    showFavoritesSection();
});

// Evento ao clicar no botão de vídeos
document.getElementById('videos-button').addEventListener('click', () => {
    showVideosSection();
});

// Mostrar seção de favoritos e esconder de vídeos
function showFavoritesSection() {
    document.getElementById('videos-section').style.display = 'none';
    document.getElementById('favorites-section').style.display = 'grid';
    loadMoreButton.style.display = 'none'; // Ocultar botão "Carregar mais vídeos" na seção de favoritos
}

// Mostrar seção de vídeos e esconder de favoritos
function showVideosSection() {
    document.getElementById('videos-section').style.display = 'grid';
    document.getElementById('favorites-section').style.display = 'none';
    loadMoreButton.style.display = 'block'; // Mostrar botão "Carregar mais vídeos" na seção de vídeos
}

// Adicionar ou remover vídeo dos favoritos
function toggleFavorite(videoId) {
    const index = favorites.indexOf(videoId);
    if (index === -1) {
        favorites.push(videoId);
    } else {
        favorites.splice(index, 1);
    }
    updateFavoritesUI();
}

// Verificar se um vídeo é favorito
function isFavorite(videoId) {
    return favorites.includes(videoId);
}

// Atualizar interface dos favoritos
function updateFavoritesUI() {
    favoritesContainer.innerHTML = '';
    favorites.forEach(videoId => {
        const videoItem = createVideoItem(videoId, true);
        favoritesContainer.appendChild(videoItem);
    });
    favoritesCount.textContent = favorites.length;

    // Atualizar estrelas nos vídeos gerais
    const allVideoItems = document.querySelectorAll('.video-item');
    allVideoItems.forEach(item => {
        const videoId = item.dataset.videoId;
        const favoriteButton = item.querySelector('.favorite-button');
        if (favoriteButton) {
            if (isFavorite(videoId)) {
                favoriteButton.classList.add('active');
            } else {
                favoriteButton.classList.remove('active');
            }
        }
    });
}

// Limpar conteúdo dos contêineres de vídeos
function clearVideoContainers() {
    videosContainer.innerHTML = '';
}

// Criar elemento de vídeo
function createVideoItem(videoId, isFavorite = false) {
    const videoItem = document.createElement('div');
    videoItem.classList.add('video-item');
    videoItem.dataset.videoId = videoId; // Armazenar o ID do vídeo como atributo data

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.allowFullscreen = true;
    videoItem.appendChild(iframe);

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('favorite-button');
    if (isFavorite) {
        favoriteButton.classList.add('active'); // Adicionar classe 'active' se for favorito
    }
    favoriteButton.textContent = isFavorite ? '★' : '★'; // Definir texto da estrela
    favoriteButton.addEventListener('click', () => toggleFavorite(videoId));
    videoItem.appendChild(favoriteButton);

    return videoItem;
}

// Buscar vídeos do YouTube
async function fetchVideos(query, pageToken = '') {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&maxResults=12&q=${query}&pageToken=${pageToken}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error('Erro ao buscar vídeos:', data.error.message);
            return;
        }
        
        nextPageToken = data.nextPageToken || '';

        data.items.forEach(item => {
            const videoId = item.id.videoId;
            const videoItem = createVideoItem(videoId, isFavorite(videoId));
            videosContainer.appendChild(videoItem);
        });
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
    }
}
