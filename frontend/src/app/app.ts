import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Gaming Explorer');

  // Temporary skeleton check: whether each backend service answers through the proxy
  protected readonly services = [
    { name: 'catalog-service', health: httpResource.text(() => '/health/catalog') },
    { name: 'library-service', health: httpResource.text(() => '/health/library') },
  ];
}
