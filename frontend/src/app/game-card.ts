import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from './games.api';

/* Reusable game card: cover, title, release date, average rating, main platforms.
 * Used by the Home grid now and by the search results list later */
@Component({
	selector: 'app-game-card',
	imports: [RouterLink, DatePipe, DecimalPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
	<a class="game-card" [routerLink]="['/games', game().id]">
		<span class="ph-poster" [class.ph-poster--cover]="game().background_image">
		@if (game().background_image) {
			<img [src]="game().background_image" [alt]="'Copertina di ' + game().name" loading="lazy" />
		}
		@if (label()) {
			<span class="ph-poster__n">{{ label() }}</span>
		}
		</span>
		<span class="game-card__body">
		<strong class="game-card__title">{{ game().name }}</strong>
		<span class="game-card__meta">
			@if (game().released) {
			{{ game().released | date: 'd MMM y' }}
			} @else {
			Data n.d.
			}
			&middot;
			@if (game().rating > 0) {
				<span class="game-card__rating">★ {{ game().rating | number: '1.1-1' }}</span>
			} @else {
				n.d.
			}
		</span>
		@if (platforms()) {
			<span class="game-card__platforms">{{ platforms() }}</span>
		}
		</span>
	</a>
	`,
	styles: `
	:host { display: block; }
	.game-card { display: block; color: inherit; text-decoration: none; }
	.ph-poster { background: var(--ge-band); transition: transform .2s ease, box-shadow .2s ease; }
	.game-card:hover .ph-poster, .game-card:focus-visible .ph-poster { transform: translateY(-3px); }
	.ph-poster--cover::after { display: none; }
	.ph-poster--cover::before {
		content: ""; position: absolute; inset: 0; z-index: 1;
		background: linear-gradient(180deg, rgba(0, 0, 0, .45), transparent 40%);
	}
	img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
	.ph-poster__n { z-index: 2; }
	.game-card__body { display: flex; flex-direction: column; gap: .1rem; padding-top: .55rem; }
	.game-card__title {
		font-size: .74rem; font-weight: 600; line-height: 1.25;
		display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
	}
	.game-card__meta, .game-card__platforms { font-size: .64rem; color: var(--ge-muted); }
	.game-card__rating { color: var(--ge-accent); }
	.game-card__platforms { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	`,
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