# Gaming Explorer

Web application to explore the world of video games through the
[RAWG](https://rawg.io/apidocs) REST API: search, filters, detail pages, favorites
and wishlist.

> 🚧 Work in progress — school project, delivery on 15 November 2026.

## Features

Core:

- **Home page** with a search bar and a selection of games
- **Search** by full or partial game name
- **Advanced search** by genre, platform, release year and rating, with sorting
  (name, release date, rating)
- **Game list** as a grid of cards: cover, title, release date, rating, main platforms
- **Game detail page**: description, screenshots, genres, platforms, developer,
  publisher, rating and Metacritic score
- **Favorites**: add and remove games, view them in a dedicated page. Guests'
  favorites are kept in the browser; after login they are stored in the user's account
- Clear **loading, error and empty-result** states
- **Responsive** layout for desktop, tablet and smartphone

Planned extras:

- **User accounts**: register and log in (JWT). Everything stays usable without an
  account; logging in keeps favorites and wishlist in the database, across devices
- **Wishlist**: games to buy or try, separate from favorites
- **Dark / light mode**, remembered across visits

## Stack

- **Backend:** ASP.NET Core (.NET 10) microservices, Entity Framework Core
- **Frontend:** Angular + Bootstrap
- **Database:** SQL Server Express
- **Infrastructure:** Docker Compose, nginx as gateway

## Getting started

You need **Docker** (with Compose). To work on the code outside Docker you also need
the **.NET SDK 10** and **Node.js 24**.

### Run everything

```bash
cp .env.example .env          # then set MSSQL_SA_PASSWORD in .env
docker compose up -d --build
```

Open http://localhost:8080. Stop with `docker compose down` (the database is kept;
add `-v` to delete it).

### Develop

Run in Docker what you are not changing, and locally what you are working on:

- **Frontend:** with the stack running, `cd frontend && npm ci && npm start`, then open
  http://localhost:4200. API calls are proxied to the services (`frontend/proxy.conf.json`).
- **A backend service:** stop its container (e.g. `docker compose stop catalog-service`),
  then `cd services/catalog-service && dotnet watch`. It listens on the same port.

| Address | What |
| ------- | ---- |
| http://localhost:8080 | the app, through the nginx gateway |
| http://localhost:4200 | Angular dev server (`npm start`) |
| http://localhost:5001 | catalog-service (direct access, e.g. Postman) |
| http://localhost:5003 | library-service (direct access) |
| localhost:1433 | SQL Server |

### Project structure

```
frontend/                 Angular app
gateway/                  nginx: serves the app and forwards calls to the services
services/catalog-service/ games data from RAWG
services/library-service/ favorites and wishlist
docker-compose.yml        the whole stack
```

## Contributing

- `main` is stable; `dev` is the integration branch.
- Work on a branch created from `dev` (`feat/...`, `fix/...`, `docs/...`, `chore/...`)
  and open a Pull Request into `dev`. At least one approval is required.
- Commits in English, [Conventional Commits](https://www.conventionalcommits.org/)
  format: `feat(catalog): add genre filter`.
- Everything in the repository (code, comments, docs) is written in English.

## Team

Marianna Cecchelli · Leonardo Marino · Renato Dei Marini
