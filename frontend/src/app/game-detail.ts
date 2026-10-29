import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GamesApi, GameDetailData, Screenshot } from './games.api';

@Component({
	selector: 'app-game-detail',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './game-detail.html',
	styleUrls: ['./game-detail.css']
})
export class GameDetail implements OnInit, OnDestroy {
	private readonly gamesApi = inject(GamesApi);
	private readonly route = inject(ActivatedRoute);
	readonly location = inject(Location);
	private readonly destroy$ = new Subject<void>();

	gameId: number | null = null;
	game: GameDetailData | null = null;
	screenshots: Screenshot[] = [];
	isLoading = true;
	hasError = false;

	ngOnInit(): void {
		this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
			const idParam = params.get('id');
			if (idParam) {
				this.gameId = parseInt(idParam, 10);
				this.fetchGameDetails(this.gameId);
			} else {
				this.isLoading = false;
				this.hasError = true;
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	fetchGameDetails(id: number): void {
		this.isLoading = true;
		this.hasError = false;

		// Run the request for basic information and screenshots in parallel
		forkJoin({
			detail: this.gamesApi.getGame(id),
			screenshotsRes: this.gamesApi.getScreenshots(id)
		}).subscribe({
			next: ({ detail, screenshotsRes }) => {
				this.game = detail;
				this.screenshots = screenshotsRes?.results || [];
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
				this.hasError = true;
			}
		});
	}

/* 	MI SERVIVA PER TESTARE, DA TOGLIERE POI
	fetchGameDetails(id: number): void {
	this.isLoading = false;
	this.hasError = false;
	this.game = {
		id: id,
		name: 'The Legend of Zelda: Tears of the Kingdom',
		slug: 'zelda-totk',
		released: '2023-05-12',
		background_image: 'https://media.rawg.io/media/games/f99/f997966e3f22d05779ec364bc9a5f22e.jpg',
		rating: 4.8,
		metacritic: 96,
		description_raw: 'An epic adventure across the land and skies of Hyrule awaits in The Legend of Zelda: Tears of the Kingdom for Nintendo Switch. In this sequel to Breath of the Wild, you’ll decide your own path through the sprawling landscapes of Hyrule and the mysterious islands floating in the vast skies above.',
		developers: [{ id: 1, name: 'Nintendo EPD', slug: 'nintendo-epd' }],
		publishers: [{ id: 1, name: 'Nintendo', slug: 'nintendo' }],
		genres: [
		{ id: 1, name: 'Action', slug: 'action' },
		{ id: 2, name: 'Adventure', slug: 'adventure' }
		],
		parent_platforms: [
		{ platform: { id: 1, name: 'Nintendo Switch', slug: 'switch' } }
		]
	};
	this.screenshots = [
		{ id: 1, image: 'https://media.rawg.io/media/screenshots/a7e/a7e289f6479f8263884d5df656c9a3eb.jpg' },
		{ id: 2, image: 'https://media.rawg.io/media/screenshots/030/03080b0e50f5550a256f642a8b9e6040.jpg' },
		{ id: 3, image: 'https://media.rawg.io/media/screenshots/81d/81d2f785a21e64627d72111867dd1f68.jpg' },
		{ id: 4, image: 'https://media.rawg.io/media/screenshots/39a/39a66420e6e76d9bf84594689dd8880d.jpg' }
	];
	} */

	goBack(): void {
		this.location.back();
	}

	// Utility to determine the CSS class for the Metacritic score
	getMetacriticClass(score: number | null | undefined): string {
		if (score === null || score === undefined) return 'score-neutral';
		if (score >= 75) return 'score-high';
		if (score >= 50) return 'score-medium';
		return 'score-low';
	}
}