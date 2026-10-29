import { Routes } from '@angular/router';
import { Home } from './home';
// Import the new page following the same style used for Home
import { GamesList } from './games-list';
// Import the game detail page
import { GameDetail } from './game-detail';

export const routes: Routes = [
	{ path: '', component: Home, title: 'Gaming Explorer' },
	// Route to the page with advanced search and grid
	{ path: 'games', component: GamesList, title: 'Ricerca Giochi' },
	// Route to the individual game detail sheet
	{ path: 'games/:id', component: GameDetail, title: 'Dettaglio Gioco' },
	
	// NB: /games & /games/:id routes are now active. Unhandled routes land on Home without errors
	{ path: '**', redirectTo: '' },
];