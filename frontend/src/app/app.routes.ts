import { Routes } from '@angular/router';
import { Home } from './home';

export const routes: Routes = [
	{ path: '', component: Home, title: 'Gaming Explorer' },
	// NB: /games and /games/:id do not exist yet. Remove this fallback when they are added;
	// the redirect keeps query params, so /games?search=... lands on Home without errors
	{ path: '**', redirectTo: '' },
];