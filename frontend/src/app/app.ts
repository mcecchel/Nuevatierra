import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
	imports: [RouterOutlet, RouterLink],
	selector: 'app-root',
	templateUrl: './app.html',
	styleUrl: './app.css',
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