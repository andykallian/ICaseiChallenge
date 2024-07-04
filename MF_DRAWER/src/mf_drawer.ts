// Interface for the video object
interface Video {
	title: string;
	favorite?: boolean;
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
	// Main app container
	document.getElementById('drawer')!.innerHTML = `
		<div id="app">
			<!-- Sidebar Menu -->
			<div id="sidebar">
				<button id="videos-button">VÍDEOS</button>
				<button id="favorites-button">FAVORITOS <span id="favorites-count">0</span></button>
			</div>
			
			<!-- Video and Favorites Section -->
			<div id="content-section">
				<div class="search-container">
					<input type="text" id="search-input" placeholder="Pesquisar" />
					<button id="search-button">🔍</button>
				</div>
				<div id="videos-section" class="video-container"></div>
				<div id="favorites-section" class="video-container" style="display: none;"></div>
				<button id="load-more">Carregar mais vídeos</button>
			</div>
		</div>
	`;

	// Adding basic interactivity (optional, depends on your application logic)
	const videosButton = document.getElementById('videos-button');
	const favoritesButton = document.getElementById('favorites-button');
	const videosSection = document.getElementById('videos-section');
	const favoritesSection = document.getElementById('favorites-section');

	videosButton?.addEventListener('click', () => {
		videosSection!.style.display = 'block';
		favoritesSection!.style.display = 'none';
	});

	favoritesButton?.addEventListener('click', () => {
		videosSection!.style.display = 'none';
		favoritesSection!.style.display = 'block';
	});
});
