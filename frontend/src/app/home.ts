import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GameCard } from './game-card';
import { GamesApi, GamesQuery } from './games.api';

const POPULAR_WINDOW_DAYS = 7;
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
			<span>Giochi popolari questa settimana</span>
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
				<div class="state"><p class="mb-0">Nessun gioco trovato per questa settimana.</p></div>
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

<!-- REVIEWS + ACTIVITY -->
<section class="band band--surface">
	<div class="container-ge">
		<div class="row gy-5">
			<div class="col-lg-7">
				<div class="section-head"><span>Recensioni popolari</span><a href="#">Altro</a></div>
				@for (r of reviews; track r.n) {
					<article class="review">
						<span class="ph-poster review__poster" [class]="'c' + r.n"><span class="ph-poster__n">{{ pad(r.n) }}</span></span>
						<div>
							<div class="review__user"><span class="avatar">{{ r.initials }}</span>{{ r.user }}</div>
							<h3 class="review__title">{{ r.title }} <span class="review__stars">{{ stars(r.rating) }}</span></h3>
							<p class="review__text">{{ r.text }}</p>
							<small class="review__likes">{{ r.likes }} apprezzamenti</small>
						</div>
					</article>
				}
			</div>
			<div class="col-lg-4 offset-lg-1">
				<div class="section-head"><span>Attività recente</span></div>
				<ul class="activity">
					@for (a of activity; track a.user) {
						<li><span class="avatar">{{ a.initials }}</span><span><strong>{{ a.user }}</strong>{{ ' ' + a.verb }}<strong>{{ a.object }}</strong>{{ a.tail }}</span></li>
					}
				</ul>
				<a class="activity__more" href="#">Esplora l’attività della community &gt;</a>
			</div>
		</div>
	</div>
</section>

<!-- POPULAR LISTS -->
<section class="band band--alt">
	<div class="container-ge">
		<div class="section-head"><span>Liste popolari</span><a href="#">Tutte le liste &gt;</a></div>
		<div class="row gy-4">
			@for (l of lists; track l.title) {
				<div class="col-md-4">
					<div class="stack">
						@for (p of l.posters; track p) {
							<span class="ph-poster" [class]="'c' + p"><span class="ph-poster__n">{{ pad(p) }}</span></span>
						}
					</div>
					<h3 class="list__title">{{ l.title }}</h3>
					<p class="list__meta">{{ l.desc }} &bull; {{ l.count }} titoli</p>
				</div>
			}
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
.band--surface { background: var(--ge-surface); }

/* Hero */
.hero {
	position: relative;
	overflow: hidden;
	padding: clamp(5rem, 14vw, 11rem) 0 4.5rem;
	background: linear-gradient(180deg, #0e161d 0%, var(--ge-bg) 100%);
}
.hero::before { /* stand-in for the hero image */
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

/* Reviews */
.review { display: flex; gap: 1rem; padding-block: 1.25rem; border-bottom: 1px solid var(--ge-border); }
.review:first-of-type { padding-top: .25rem; }
.review__poster { flex: 0 0 5.2rem; width: 5.2rem; align-self: flex-start; }
.review__user { display: flex; align-items: center; gap: .5rem; color: var(--ge-muted); font-size: .66rem; }
.review__title { margin: .5rem 0 .4rem; font-family: var(--bs-body-font-family); font-size: .9rem; font-weight: 700; letter-spacing: 0; }
.review__stars { margin-left: .35rem; color: var(--ge-accent); font-size: .68rem; letter-spacing: .08em; }
.review__text { margin: 0 0 .6rem; color: #b6c0c9; font: .78rem/1.5 Georgia, 'Times New Roman', serif; }
.review__likes { color: var(--ge-muted); font-size: .62rem; }

.avatar { display: inline-grid; place-items: center; flex: none; width: 1.5rem; height: 1.5rem; border: 1px solid var(--ge-border); border-radius: 50%; background: var(--ge-band); color: #c3ccd4; font-size: .5rem; font-weight: 700; letter-spacing: .03em; }

/* Activity */
.activity { margin: 0; padding: 0; list-style: none; }
.activity li { display: flex; align-items: center; gap: .6rem; padding-block: .75rem; border-bottom: 1px solid var(--ge-border); color: #b6c0c9; font-size: .66rem; }
.activity li:first-child { padding-top: 0; }
.activity strong { color: var(--ge-text); font-weight: 600; }
.activity__more { display: inline-block; margin-top: 1rem; color: var(--ge-accent); font-size: .62rem; font-weight: 600; letter-spacing: .08em; text-decoration: none; text-transform: uppercase; }

/* Popular lists: three overlapping posters */
.stack { display: flex; margin-bottom: 1rem; }
.stack .ph-poster { flex: none; width: 7rem; }
.stack .ph-poster + .ph-poster { margin-left: -4.25rem; }
.stack .ph-poster:nth-child(2) { z-index: 1; }
.stack .ph-poster:nth-child(3) { z-index: 2; }
.list__title { margin: 0 0 .25rem; font-family: var(--bs-body-font-family); font-size: .82rem; font-weight: 700; letter-spacing: 0; }
.list__meta { margin: 0; color: var(--ge-muted); font-size: .64rem; }

/* CTA */
.cta { padding-block: 3.5rem; background: var(--ge-band); }
.cta__title { max-width: 24rem; margin: 0; font-size: clamp(1.4rem, 3.4vw, 1.6rem); font-weight: 700; line-height: 1.25; }

/* Placeholder colours (reviews and lists, static blocks) */
.c1 { background: #2d4a6b; }
.c2 { background: #7a3f32; }
.c3 { background: #8a7355; }
.c4 { background: #44525e; }
.c5 { background: #56603a; }
.c6 { background: #7a5c54; }
`,
})
export class Home {
	private readonly api = inject(GamesApi);

	// Data layer: loaded from RAWG through the catalog-service

	protected readonly popular = rxResource({ stream: () => this.api.getGames(popularQuery()) });
	protected readonly skeletons = Array.from({ length: POPULAR_COUNT }, (_, i) => i);

	// Static content (no API in the spec for these blocks yet)

	protected readonly features = [
		{ n: '01', title: 'Tieni un diario', text: 'Registra i tuoi momenti di gioco e conserva i tuoi gameplay in una libreria personale.' },
		{ n: '02', title: 'Esprimi un giudizio', text: 'Valuta, recensisci e ritrova facilmente tutto ciò a cui hai giocato.' },
		{ n: '03', title: 'Segui le persone', text: 'Scopri cosa appassiona gli altri giocatori e trova la tua prossima avventura.' },
	];

	protected readonly reviews = [
		{ n: 1, initials: 'AM', user: 'membro_1', title: 'Titolo del gioco', rating: 4.5, likes: 12, text: 'Una riflessione breve sul film, sui suoi personaggi e sulle immagini che restano.' },
		{ n: 2, initials: 'LC', user: 'membro_2', title: 'Titolo del gioco', rating: 4, likes: 29, text: 'Una recensione della community occupa questo spazio con poche righe essenziali.' },
		{ n: 3, initials: 'RS', user: 'membro_3', title: 'Titolo del gioco', rating: 3.5, likes: 46, text: 'Impressioni, dettagli e punti di vista condivisi dopo la visione.' },
	];

	protected readonly activity = [
		{ initials: 'NV', user: 'profilo_nv', verb: 'ha aggiunto ', object: 'Gioco 01', tail: ' alla sua lista' },
		{ initials: 'EO', user: 'profilo_eo', verb: 'ha recensito ', object: 'Gioco 04', tail: '' },
		{ initials: 'GC', user: 'profilo_gc', verb: 'ha dato 4 stelle a ', object: 'Gioco 02', tail: '' },
		{ initials: 'MR', user: 'profilo_mr', verb: 'ha iniziato a seguire ', object: 'un nuovo profilo', tail: '' },
	];

	protected readonly lists = [
		{ title: 'Giochi da riscoprire', desc: 'Una selezione di titoli da recuperare', count: 18, posters: [1, 2, 3] },
		{ title: 'Avventure da vivere', desc: 'Storie che meritano di essere vissute', count: 25, posters: [2, 3, 4] },
		{ title: 'Preferiti di sempre', desc: 'I titoli che non smettono di appassionarci', count: 32, posters: [3, 4, 5] },
	];

	protected stars(rating: number): string {
		return '★'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');
	}

	protected pad(n: number): string {
		return String(n).padStart(2, '0');
	}
}