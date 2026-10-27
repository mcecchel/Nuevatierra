import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from './games.api';

/* Reusable game card: cover, title, release date, average rating, main platforms.
   Used by the Home grid now and by the search results list later */
@Component({
	selector: 'app-game-card',
	imports: [RouterLink, DatePipe, DecimalPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './game-card.html',
	styleUrl: './game-card.css',
})
export class GameCard {
	readonly game = input.required<Game>();
	// Optional rank shown on the cover ("01", "02", ...)
	readonly index = input<number>();

	protected readonly label = computed(() => {
	const i = this.index();
	return i === undefined ? '' : String(i).padStart(2, '0');
	});

	protected readonly platforms = computed(() =>
	(this.game().parent_platforms ?? [])
		.slice(0, 3)
		.map((p) => p.platform.name)
		.join(' · '),
 	);
}