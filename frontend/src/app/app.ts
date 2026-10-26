import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
	imports: [RouterOutlet, RouterLink],
	selector: 'app-root',
	template: `
<header class="site-header">
	<nav class="navbar navbar-expand-md" data-bs-theme="dark" aria-label="Navigazione principale">
		<div class="container-ge d-flex flex-wrap align-items-center justify-content-between">
			<a class="brand" routerLink="/" aria-label="Gaming Explorer, home">
				<span class="brand__dots" aria-hidden="true"><i></i><i></i><i></i></span>Gaming Explorer
			</a>

			<button class="navbar-toggler" type="button" aria-label="Apri il menu" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse justify-content-end" [class.show]="menuOpen()">
				<ul class="navbar-nav align-items-md-center gap-md-4">
					@for (link of navLinks; track link.label) {
						<li class="nav-item"><a class="nav-link" [routerLink]="link.path">{{ link.label }}</a></li>
					}
					<li class="nav-item">
						<button type="button" class="search-toggle" aria-label="Cerca un gioco" [attr.aria-expanded]="searchOpen()" (click)="toggleSearch()">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
						</button>
					</li>
					<li class="nav-item"><a class="btn btn-user" href="#">Area utente</a></li>
				</ul>
			</div>
		</div>

		@if (searchOpen()) {
			<form class="container-ge search-bar" role="search" (submit)="search($event, searchInput.value)">
				<input #searchInput type="search" class="form-control" placeholder="Cerca un videogioco per nome…" aria-label="Cerca un videogioco" />
				<button type="submit" class="btn btn-ge">Cerca</button>
			</form>
		}
	</nav>
</header>

<main><router-outlet /></main>

<footer class="site-footer">
	<div class="container-ge d-flex flex-wrap align-items-center justify-content-between gap-3">
		<a class="brand" routerLink="/"><span class="brand__dots" aria-hidden="true"><i></i><i></i><i></i></span>Gaming Explorer</a>
		<ul class="footer-links">
			@for (l of footerLinks; track l) {
				<li><a href="#">{{ l }}</a></li>
			}
		</ul>
		<small class="footer-note">Interfaccia dimostrativa &bull; Nessun asset fotografico utilizzato</small>
	</div>
</footer>
`,
	styles: `
.site-header { position: sticky; top: 0; z-index: 10; background: rgba(11, 18, 24, .92); backdrop-filter: blur(6px); border-bottom: 1px solid #16232d; }
.navbar { --bs-navbar-padding-y: .55rem; min-height: 3.6rem; }

.brand { display: inline-flex; align-items: center; gap: .55rem; color: var(--ge-text); font-family: 'Inter', system-ui, sans-serif; font-size: .8rem; font-weight: 700; text-decoration: none; }
.brand__dots { display: inline-flex; gap: 2px; }
.brand__dots i { width: 7px; height: 7px; border-radius: 50%; background: var(--ge-accent); }
.brand__dots i:nth-child(2) { background: #f5a623; }
.brand__dots i:nth-child(3) { background: #e5544b; }

.nav-link { --bs-nav-link-padding-x: 0; --bs-navbar-nav-link-padding-x: 0; color: #c3ccd4; font-size: .62rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; }
.nav-link:hover, .nav-link:focus-visible { color: var(--ge-text); }

.search-toggle { display: inline-grid; place-items: center; padding: .25rem; background: none; border: 0; color: #c3ccd4; }
.search-toggle:hover { color: var(--ge-text); }

.btn-user { padding: .45rem .9rem; background: #2a3a45; border: 0; border-radius: 3px; color: var(--ge-text); font-size: .62rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.btn-user:hover { background: #34495a; color: #fff; }

.search-bar { display: flex; gap: .5rem; padding-block: .6rem .85rem; }
.search-bar .form-control { background: var(--ge-surface); border-color: var(--ge-border); color: var(--ge-text); font-size: .85rem; }
.search-bar .form-control:focus { border-color: var(--ge-accent); box-shadow: none; }

.site-footer { padding-block: 1.6rem; background: var(--ge-bg); border-top: 1px solid #16232d; }
.footer-links { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; margin: 0; padding: 0; list-style: none; }
.footer-links a { color: var(--ge-muted); font-size: .62rem; text-decoration: none; }
.footer-links a:hover { color: var(--ge-text); }
.footer-note { color: #5b6a77; font-size: .6rem; }

@media (max-width: 767.98px) {
	.navbar-nav { padding-block: .75rem; gap: .5rem; }
}
`,
})
export class App {
	private readonly router = inject(Router);
	private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

	protected readonly menuOpen = signal(false);
	protected readonly searchOpen = signal(false);

	protected readonly navLinks = [
		{ label: 'Giochi', path: '/games' },
		{ label: 'Recensioni', path: '/' },
		{ label: 'Liste', path: '/' },
	];
	protected readonly footerLinks = ['Chi siamo', 'Aiuto', 'Termini', 'Privacy', 'Contatti'];

	protected toggleSearch(): void {
		this.searchOpen.update((open) => !open);
		// The input exists only after the next render
		setTimeout(() => this.searchInput()?.nativeElement.focus());
	}

	// Basic search: hands the term to the games list page (/games?search=...)
	protected search(event: Event, term: string): void {
		event.preventDefault();
		const search = term.trim();
		if (!search) return;
		this.searchOpen.set(false);
		this.menuOpen.set(false);
		this.router.navigate(['/games'], { queryParams: { search } });
	}
}