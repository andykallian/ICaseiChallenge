interface Video {
	id: {
		videoId: string;
	};
	favorite?: boolean;
	snippet: {
		title: string;
		description: string;
		thumbnails: {
			default: {
				url: string;
				width: number;
				height: number;
			};
			medium: {
				url: string;
				width: number;
				height: number;
			};
			high: {
				url: string;
				width: number;
				height: number;
			};
		};
	};
}

let currentType: 'videos' | 'favorites' = 'videos';
let currentVideos: Video[] = [];

document.addEventListener('DOMContentLoaded', function () {
	// Mostrar a lista inicial de vídeos
	showVideos();

	// Atualiza o contador de favoritos
	updateFavoriteCounter();

	function updateContent(event: CustomEvent<{ type: typeof currentType; data: Video[] }>) {
		const { type, data } = event.detail;
		currentType = type;
		currentVideos = data;
		displayVideos(currentVideos, true);
	}

	function showVideos() {
		fetch('/videos/api/videos')
			.then((response) => response.json())
			.then((data: Video[]) => {
				const event = new CustomEvent('updateContent', {
					detail: { type: 'videos', data },
				});
				window.dispatchEvent(event);
				updateFavoriteCounter();
			});
	}

	function showFavorites() {
		fetch('/videos/api/favorites')
			.then((response) => response.json())
			.then((data: Video[]) => {
				const event = new CustomEvent('updateContent', {
					detail: { type: 'favorites', data },
				});
				window.dispatchEvent(event);
				updateFavoriteCounter();
			});
	}

	function updateFavoriteCounter() {
		fetch('/videos/api/favorites')
			.then((response) => response.json())
			.then((favorites: Video[]) => {
				const favoritesCount = document.getElementById('favorites-count');
				if (favoritesCount) {
					favoritesCount.textContent = `${favorites.length}`;
				}
			});
	}

	function toggleFavorite(video: Video, favoriteIcon: HTMLElement) {
		fetch('/videos/api/videos/favorite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ videoId: video.id.videoId }),
		}).then(() => {
			video.favorite = !video.favorite;
			favoriteIcon.className = video.favorite ? 'favorited' : 'not-fav';
			updateFavoriteCounter();

			if (currentType === 'favorites' && !video.favorite) {
				currentVideos = currentVideos.filter(
					(v) => v.id.videoId !== video.id.videoId
				);
				displayVideos(currentVideos, true);
			}
		});
	}

	function addSearchEventListener() {
		const searchInput = document.getElementById('search-input') as HTMLInputElement;
		const searchButton = document.getElementById('search-button');

		searchButton?.addEventListener('click', () => {
			searchVideos(searchInput.value);
		});

		searchInput.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				searchVideos(searchInput.value);
			}
		});
	}

	async function searchVideos(query: string) {
		if (!query) return;
		try {
			const response = await fetch(`/videos/api/search?query=${encodeURIComponent(query)}`);
			const data = await response.json();
			displayVideos(data.items, true);
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	}

	function displayVideos(videos: Video[], clearContent: boolean) {
		const videosSection = document.getElementById('videos-section');
		const favoritesSection = document.getElementById('favorites-section');
		const container = currentType === 'videos' ? videosSection : favoritesSection;
		
		if (!container) return;

		if (clearContent) {
			container.innerHTML = '';
		}

		videos.forEach((video) => {
			const videoElement = document.createElement('div');
			videoElement.className = 'video-element';

			const thumbnail = document.createElement('img');
			thumbnail.className = 'video-thumbnail';
			thumbnail.src = video.snippet.thumbnails.high.url;
			thumbnail.alt = video.snippet.title;

			const title = document.createElement('div');
			title.className = 'video-title';
			title.textContent = video.snippet.title;

			const favoriteButton = document.createElement('button');
			const favoriteIcon = document.createElement('i');
			favoriteIcon.textContent = 'star';
			favoriteIcon.className = video.favorite ? 'favorited' : 'not-fav';

			favoriteButton.appendChild(favoriteIcon);
			favoriteButton.onclick = () => {
				toggleFavorite(video, favoriteIcon);
			};

			videoElement.appendChild(thumbnail);
			videoElement.appendChild(title);
			videoElement.appendChild(favoriteButton);
			container.appendChild(videoElement);
		});
	}

	document.getElementById('videos-button')!.addEventListener('click', () => {
		document.getElementById('videos-section')!.style.display = 'block';
		document.getElementById('favorites-section')!.style.display = 'none';
		showVideos();
	});

	document.getElementById('favorites-button')!.addEventListener('click', () => {
		document.getElementById('videos-section')!.style.display = 'none';
		document.getElementById('favorites-section')!.style.display = 'block';
		showFavorites();
	});

	addSearchEventListener();

	document.getElementById('load-more')!.addEventListener('click', () => {
		if (currentType === 'videos') {
			showVideos();
		} else {
			showFavorites();
		}
	});
});
