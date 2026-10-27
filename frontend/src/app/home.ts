import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GameCard } from './game-card';
import { GamesApi, GamesQuery } from './games.api';

const POPULAR_WINDOW_DAYS = 30;
const POPULAR_COUNT = 6;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

function popularQuery(): GamesQuery {
	const end = new Date();
	const start = new Date();
	start.setDate(end.getDate() - POPULAR_WINDOW_DAYS);
	return { dates: `${isoDay(start)},${isoDay(end)}`, ordering: '-added', page_size: POPULAR_COUNT };
}

@Component({
	selector: 'app-home',
	imports: [RouterLink, GameCard],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
<!-- HERO -->
<section class="hero">
	<div class="container-ge">
		<p class="eyebrow mb-3">La tua storia, pixel dopo pixel</p>
		<h1>Scopri nuovi giochi.<br />Racconta quelli che ami.</h1>
		<p class="hero__lead">
			Tieni traccia delle tue avventure, crea liste e scopri nuovi titoli insieme a una community di appassionati.
		</p>
		<div class="d-flex flex-wrap align-items-center gap-3">
			<a class="btn btn-ge" routerLink="/">Crea il tuo account</a>
			<small class="hero__note">È gratuito. Nessuna pubblicità invadente.</small>
		</div>
	</div>
</section>

<!-- POPULAR GAMES (RAWG /games) + ABOUT -->
<section class="band band--alt">
	<div class="container-ge">
		<div class="section-head">
			<span>Giochi popolari questo mese</span>
			<a routerLink="/games">Tutti i giochi &gt;</a>
		</div>

		@if (popular.isLoading()) {
			<div class="row row-cols-3 row-cols-md-6 games-grid" aria-busy="true" aria-label="Caricamento dei giochi">
				@for (s of skeletons; track s) {
					<div class="col"><span class="ph-poster skeleton"></span></div>
				}
			</div>
		} @else if (popular.error()) {
			<div class="state" role="alert">
				<p class="mb-3">Impossibile caricare i giochi. Controlla la connessione e riprova.</p>
				<button type="button" class="btn btn-ge" (click)="popular.reload()">Riprova</button>
			</div>
		} @else {
			@let games = popular.value()?.results ?? [];
			@if (games.length) {
				<div class="row row-cols-3 row-cols-md-6 games-grid">
					@for (game of games; track game.id; let i = $index) {
						<div class="col"><app-game-card [game]="game" [index]="i + 1" /></div>
					}
				</div>
			} @else {
				<div class="state"><p class="mb-0">Nessun gioco trovato per questo periodo.</p></div>
			}
		}

		<h2 class="about__title">GameLog ti aiuta a ricordare, scoprire e condividere i videogiochi.</h2>
		<div class="features">
			<div class="row row-cols-1 row-cols-md-3 gy-4">
				@for (f of features; track f.n) {
					<div class="col">
						<span class="features__n">{{ f.n }}</span>
						<h3 class="features__title">{{ f.title }}</h3>
						<p class="features__text">{{ f.text }}</p>
					</div>
				}
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="cta">
	<div class="container-ge d-flex flex-wrap align-items-center justify-content-between gap-4">
		<div>
			<p class="eyebrow mb-2">Inizia il tuo diario</p>
			<h2 class="cta__title">Ogni gioco racconta anche qualcosa di te.</h2>
		</div>
		<a class="btn btn-ge" routerLink="/">Unisciti alla community</a>
	</div>
</section>
`,
	styles: `
:host { display: block; }

/* Bands */
.band { padding-block: 4rem; }
.band--alt { background: var(--ge-bg-alt); }

/* Hero */
.hero {
	position: relative;
	overflow: hidden;
	padding: clamp(5rem, 14vw, 11rem) 0 4.5rem;
	background: linear-gradient(180deg, #0e161d 0%, var(--ge-bg) 100%);
}
.hero::before {
	content: "";
	position: absolute;
	inset: 0 28%;
	background: rgba(255, 255, 255, 0.025);
	border-inline: 1px solid rgba(255, 255, 255, 0.06);
}
.hero > .container-ge { position: relative; }
.hero h1 { font-size: clamp(2rem, 6vw, 2.75rem); font-weight: 800; line-height: 1.2; margin: 0; }
.hero__lead { max-width: 29rem; margin: 1.1rem 0 1.5rem; color: #aab6c0; font-size: .9rem; line-height: 1.65; }
.hero__note { color: var(--ge-muted); font-size: .68rem; }

/* Popular games grid */
.games-grid { --bs-gutter-x: .75rem; --bs-gutter-y: 1rem; }
.skeleton { background: var(--ge-band); animation: pulse 1.2s ease-in-out infinite alternate; }
.skeleton::after { display: none; }
@keyframes pulse { to { opacity: .45; } }
.state { padding: 2.5rem 1rem; text-align: center; color: var(--ge-muted); border: 1px solid var(--ge-border); border-radius: 3px; }

/* About + features */
.about__title { max-width: 34rem; margin: 4rem 0 2rem; font-size: clamp(1.4rem, 3.4vw, 1.6rem); font-weight: 700; line-height: 1.3; }
.features { padding: 1.5rem; background: var(--ge-surface); border: 1px solid var(--ge-border); border-radius: 3px; }
.features__n { color: var(--ge-accent); font-size: .72rem; font-weight: 700; }
.features__title { margin: 1.4rem 0 .5rem; font-family: var(--bs-body-font-family); font-size: .9rem; font-weight: 700; letter-spacing: 0; }
.features__text { margin: 0; color: var(--ge-muted); font-size: .72rem; line-height: 1.6; }

/* CTA */
.cta { padding-block: 3.5rem; background: var(--ge-band); }
.cta__title { max-width: 24rem; margin: 0; font-size: clamp(1.4rem, 3.4vw, 1.6rem); font-weight: 700; line-height: 1.25; }
`,
})
export class Home {
	private readonly api = inject(GamesApi);

	protected readonly popular = rxResource({ stream: () => this.api.getGames(popularQuery()) });
	protected readonly skeletons = Array.from({ length: POPULAR_COUNT }, (_, i) => i);

	protected readonly features = [
		{ n: '01', title: 'Tieni un diario', text: 'Registra i tuoi momenti di gioco e conserva i tuoi gameplay in una libreria personale.' },
		{ n: '02', title: 'Esprimi un giudizio', text: 'Valuta, recensisci e ritrova facilmente tutto ciò a cui hai giocato.' },
		{ n: '03', title: 'Segui le persone', text: 'Scopri cosa appassiona gli altri giocatori e trova la tua prossima avventura.' },
	];
}