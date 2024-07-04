import express, { Request, Response } from 'express';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname + 'styles')));

app.use(
	'/drawer',
	express.static(path.join(__dirname, '../MF_DRAWER/dist'), {
		setHeaders: (res, path) => {
			if (path.endsWith('.js')) {
				res.setHeader('Content-Type', 'application/javascript');
			}
		},
	})
);

app.use(
	'/videos',
	express.static(path.join(__dirname, '../MF_VIDEOS/dist'), {
		setHeaders: (res, path) => {
			if (path.endsWith('.js')) {
				res.setHeader('Content-Type', 'application/javascript');
			}
		},
	})
);

app.use('/styles', express.static('styles'));

app.get('/', (req: Request, res: Response) => {
	res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
						<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Desafio Icasei</title>
						<link rel="stylesheet" href="/styles/styles.css">
        </head>
        <body>
            <div id="drawer"></div>
            <div id="videos"></div>
            <script src="/drawer/mf_drawer.js"></script>
            <script src="/videos/mf_videos.js"></script>
        </body>
        </html>
    `);
});

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

interface VideoResponse {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: { totalResults: number; resultsPerPage: number };
	items: Video[];
}

type VideosType = VideoResponse[];

const videos: VideosType = [];

app.get('/videos/api/videos', (req: Request, res: Response) => {
	res.json(videos.map((video) => video.items));
});

app.get('/videos/api/favorites', (req: Request, res: Response) => {
	const favoriteVideos = videos.flatMap((videoResponse) =>
		videoResponse.items.filter((video) => video.favorite)
	);

	res.json(favoriteVideos);
});

app.post(
	'/videos/api/videos/favorite',
	express.json(),
	(req: Request<{}, {}, { videoId: string }>, res: Response) => {
		const { videoId } = req.body;

		let videoFound = false;

		videos.forEach((videoResponse) => {
			videoResponse.items.forEach((video) => {
				if (video.id.videoId === videoId) {
					video.favorite = !video.favorite;
					videoFound = true;
				}
			});
		});

		if (videoFound) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Video not found' });
		}
	}
);

app.get('/videos/api/search', async (req: Request, res: Response) => {
	const query = req.query.query as string;
	const apiKey = process.env.YOUTUBE_API_KEY;
	const resultsPerPage = 12;

	try {
		const response = await axios.get(
			`https://www.googleapis.com/youtube/v3/search`,
			{
				params: {
					part: 'snippet',
					q: query,
					type: 'video',
					key: apiKey,
					maxResults: resultsPerPage.toString(),
				},
			}
		);

		res.json(response.data);
		videos.push(response.data);
		console.log(videos.map((item) => item.items.filter((i) => i.snippet)));
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
	}
});

app.listen(port, () => {
	console.log(`BFF running at http://localhost:${port}`);
});
