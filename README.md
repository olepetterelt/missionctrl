# MissionCtrl

[MissionCtrl.no](https://missionctrl.no/) is a space dashboard for following rocket launches, tracking the International Space Station, checking space weather, and exploring the night sky.

## Run locally

From the repository root, serve the files over HTTP. For example, with Python 3 installed, run `python -m http.server 8000` and open `http://localhost:8000/`. The static preview serves the pages and browser-side feeds. The `/nasa` and `/n2yo` routes require the Cloudflare Pages Functions runtime.

## Data sources

- **Launches and news** use Launch Library 2 and Spaceflight News API.
- **ISS tracking** uses Where the ISS at? for dashboard position, altitude, and speed. The N2YO function provides a position fallback and supports visible-pass predictions.
- **Space weather** uses NOAA Space Weather Prediction Center data. Aurora visibility is an estimate based on the selected location.
- **NASA imagery and asteroid data** use the NASA function.

In Cloudflare Pages, configure `NASA_API_KEY` and `N2YO_API_KEY` as server-side secrets to enable their respective routes. The public dashboard feeds can run without those keys.

## Changes and rollback

See [CHANGELOG.md](CHANGELOG.md) for changes, their rationale, and verification notes. To undo a release, open its merged pull request on GitHub, select **Revert**, and merge the resulting pull request. The rollback stays in the Git history.
