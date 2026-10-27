import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GameCard } from './game-card';
import { GamesApi, GamesQuery } from './games.api';

// Popular this week = most added games released in the last N days
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
	templateUrl: './home.html',
	styleUrl: './home.css',
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