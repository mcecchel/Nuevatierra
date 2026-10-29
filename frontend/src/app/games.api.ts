// defines the RAWG data types (Game, GamesPage, GamesQuery) and a class with only
// one method, getGames(query), which calls GET/api/games with the parameters to
// keep API calls separate from graphics
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/*******************************************************************************
 *   Models (subset of the RAWG /games payload)                                *
 ******************************************************************************/
export interface Platform {
	id: number;
	name: string;
	slug: string;
}

export interface Game {
	id: number;
	name: string;
	slug: string;
	released: string | null;// yyyy-mm-dd
	background_image: string | null;
	rating: number;// 0-5, 0 when nobody rated it yet
	metacritic: number | null;
	parent_platforms?: { platform: Platform }[];
}

export interface GamesPage {
	count: number;
	next: string | null;
	previous: string | null;
	results: Game[];
}

// Templates for Genres and Platforms (required for search filters)
export interface Genre {
	id: number;
	name: string;
	slug: string;
}
export interface PlatformItem {
	id: number;
	name: string;
	slug: string;
}
// Pagination for Genres and Platforms following the GamesPage pattern
export interface GenresPage {
	count: number;
	results: Genre[];
}
export interface PlatformsPage {
	count: number;
	results: PlatformItem[];
}

// Templates for the detail card and screenshots
export interface Developer {
	id: number;
	name: string;
	slug: string;
}
export interface Publisher {
	id: number;
	name: string;
	slug: string;
}
export interface Screenshot {
	id: number;
	image: string;
}
export interface GameDetailData extends Game {
	description_raw?: string;
	developers?: Developer[];
	publishers?: Publisher[];
	genres?: Genre[];
}
export interface ScreenshotsResponse {
	count?: number;
	results: Screenshot[];
}

// Query parameters accepted by GET /api/games (same names as RAWG's /games)
export interface GamesQuery {
	search?: string;
	genres?: string;
	platforms?: string;
	dates?: string;// "yyyy-mm-dd,yyyy-mm-dd"
	ordering?: string;// e.g. "-added", "-rating", "name"
	metacritic?: string;// "80,100"
	page?: number;
	page_size?: number;
}

/*******************************************************************************
 *   API layer                                                                 *
 ******************************************************************************/
/* Single entry point to the catalog-service. The RAWG key lives in the backend,
 * so the browser only ever talks to our own /api (proxy.conf.json in dev, nginx in Docker).
 * Components never build URLs: they call a method here */
@Injectable({ providedIn: 'root' })
export class GamesApi {
	private readonly http = inject(HttpClient);

	getGames(query: GamesQuery = {}): Observable<GamesPage> {
		const params: Record<string, string | number> = {};
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined && value !== '')
					params[key] = value;
		}
		return this.http.get<GamesPage>('/api/games', { params });
	}

	// Methods for retrieving curtain filter data
	getGenres(): Observable<GenresPage> {
		return this.http.get<GenresPage>('/api/genres');
	}
	getPlatforms(): Observable<PlatformsPage> {
		return this.http.get<PlatformsPage>('/api/platforms');
	}

	// Methods for retrieving detail information and screenshots of the individual game
	getGame(id: number): Observable<GameDetailData> {
		return this.http.get<GameDetailData>(`/api/games/${id}`);
	}
	getScreenshots(id: number): Observable<ScreenshotsResponse> {
		return this.http.get<ScreenshotsResponse>(`/api/games/${id}/screenshots`);
	}
}