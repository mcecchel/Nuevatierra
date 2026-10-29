import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GamesApi, Game, Genre, PlatformItem, GamesQuery } from './games.api';
import { GameCard } from './game-card';// NB: assicurarsi che l'export si chiami GameCard

@Component({
	selector: 'app-games-list',// NB: anche qui check se nel progetto si usano prefissi diversi
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule, GameCard],
	templateUrl: './games-list.html',
	styleUrls: ['./games-list.css']
})
export class GamesList implements OnInit, OnDestroy {
	private readonly gamesApi = inject(GamesApi);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly destroy$ = new Subject<void>();

	games: Game[] = [];
	genres: Genre[] = [];
	platforms: PlatformItem[] = [];

	totalResults = 0;
	totalPages = 1;
	pageSize = 24;

	isLoading = true;
	hasError = false;
	showMobileFilters = false;

	// Filter Status mapped to your GamesQuery
	currentQuery: GamesQuery = {
		page: 1,
		page_size: 24,
		ordering: '-rating'
	};

	years: number[] = [];
	selectedYear = '';// Support variable to generate GamesQuery "dates"

	ngOnInit(): void {
		this.initYears();
		this.loadGenresAndPlatforms();

		// Listen for params queries from the URL to sync filters and launch the search
		this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.currentQuery.search = params['search'] || undefined;
			this.currentQuery.genres = params['genres'] || undefined;
			this.currentQuery.platforms = params['platforms'] || undefined;
			this.selectedYear = params['year'] || '';
			this.currentQuery.metacritic = params['metacritic'] || undefined;
			this.currentQuery.ordering = params['ordering'] || '-rating';
			this.currentQuery.page = params['page'] ? parseInt(params['page'], 10) : 1;

			// Rebuilds the 'dates' param as required by RAWG ("yyyy-mm-dd,yyyy-mm-dd")
			if (this.selectedYear) {
				this.currentQuery.dates = `${this.selectedYear}-01-01,${this.selectedYear}-12-31`;
			} else {
				this.currentQuery.dates = undefined;
			}

			this.fetchGames();
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private initYears(): void {
		const currentYear = new Date().getFullYear();
		for (let year = currentYear; year >= 1990; year--) {
			this.years.push(year);
		}
	}

	private loadGenresAndPlatforms(): void {
		this.gamesApi.getGenres().subscribe({
			next: res => (this.genres = res.results || []),
			error: () => console.error('Errore nel caricamento dei generi')
		});

		this.gamesApi.getPlatforms().subscribe({
			next: res => (this.platforms = res.results || []),
			error: () => console.error('Errore nel caricamento delle piattaforme')
		});
	}

	fetchGames(): void {
		this.isLoading = true;
		this.hasError = false;

		// Call the getGames() method you defined, using your GamesQuery interface
		this.gamesApi.getGames(this.currentQuery).subscribe({
			next: res => {
				this.games = res.results || [];
				this.totalResults = res.count || 0;
				this.totalPages = Math.ceil(this.totalResults / (this.currentQuery.page_size || 24)) || 1;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
				this.hasError = true;
			}
		});
	}

	// Event handlers for filter changes, search submission, and pagination
	onFilterChange(): void {
		this.updateQueryParams(1);
	}

	onSearchSubmit(): void {
		this.updateQueryParams(1);
	}

	onPageChange(newPage: number): void {
		if (newPage < 1 || newPage > this.totalPages) return;
		this.updateQueryParams(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	resetFilters(): void {
		this.currentQuery.search = undefined;
		this.currentQuery.genres = undefined;
		this.currentQuery.platforms = undefined;
		this.selectedYear = '';
		this.currentQuery.metacritic = undefined;
		this.currentQuery.ordering = '-rating';
		this.updateQueryParams(1);
	}

	toggleMobileFilters(): void {
		this.showMobileFilters = !this.showMobileFilters;
	}

	private updateQueryParams(page: number): void {
		const queryParams = {
			search: this.currentQuery.search || null,
			genres: this.currentQuery.genres || null,
			platforms: this.currentQuery.platforms || null,
			year: this.selectedYear || null,
			metacritic: this.currentQuery.metacritic || null,
			ordering: this.currentQuery.ordering !== '-rating' ? this.currentQuery.ordering : null,
			page: page > 1 ? page : null
		};

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams,
			queryParamsHandling: 'merge'
		});
	}
}