# Changelog

## 2026-11-25

### Automatic mission and rover updates

- Fixed two issues found in production. Curiosity now uses NASA’s raw image listing, and the browser requests Launch Library 2 events directly with a 15-minute session cache after the Cloudflare request returned a gateway error. Photojournal cards also use lead images embedded in NASA’s RSS articles. Checked the upstream response shapes and CORS headers. Final deployment verification is pending.

- Connected the Mission Watchlist and dashboard to public Launch Library 2 events, including published webcasts and date precision. Connected Mars Rovers to NASA research updates, Photojournal releases, and raw image feeds, with newer rover photos eligible for the dashboard.
- Added a cached Cloudflare Pages Function to refresh public feeds without new keys. Visible pages refresh every 15 minutes and keep the last successful results during feed failures. Featured editorial stories remain available as fallbacks.
- Verified JavaScript syntax and tested route selection, caching headers, malformed responses, event dates and webcasts, rover metadata, failure retention, and hidden-tab behavior with fixtures. Live upstream payloads, deployment, and browser layout still need verification.
- Close the automation PR before merge or use GitHub’s **Revert** action after merge.

### Mission Watchlist and Mars Rovers

- Added a watchlist for Moon and Mars, deep space, commercial spaceflight, and space telescope milestones. The dashboard highlights the next dated event, with a webcast when published. Passed windows await an official update.
- Added Curiosity and Perseverance photos with camera, capture date, sol, and credit, plus dated research summaries and links to NASA originals, raw galleries, and mission updates. Added a dashboard photo and cross-links with Mars Weather so visitors can follow rover science.
- Updated Ingenuity descriptions to reflect the end of its 72-flight mission. Added Mars Rovers to shared navigation and the sitemap.
- Verified JavaScript syntax, milestone selection and expiry, rover captions and dashboard links, and both NASA image URLs. Browser and production checks are pending. Close the PR before merge or use the GitHub **Revert** action after merge.

### Artemis

- Versioned the navigation script on the dashboard, Missions, and Artemis so visitors get the new Artemis tab even if their browser cached the previous menu. Added a revalidation policy for the shared script.

- Added a dedicated Artemis tab and sitemap entry. The page compares Artemis I–V, documents completed-flight measurements and crews, and separates NASA's future targets from confirmed results.
- Added mission milestones, published Artemis III docking and orbit figures, lunar landing plans, vehicle specifications, and primary-source links so readers can check the figures and follow changes to the campaign.
- Checked navigation, page anchors, and the static route. Live deployment verification is pending.

### Today in Space

- Moved the latest headlines, next launch, and Tonight near you to the top of the dashboard so visitors can see the daily briefing before the detailed telemetry. The launch card shows a UTC launch window and a webcast link when the feed provides them.
- Checked dashboard script syntax and briefing card rendering. Production verification is pending.

### ISS live camera

- Configured the ISS camera to load with the dashboard and autoplay muted so visitors can start watching without pressing Play, subject to their browser's autoplay settings.

- Replaced the private YouTube video with the public feed embedded on NASA's ISS Earth-viewing page. Added links to NASA's camera page and station views playlist so viewers can try the official sources if the dashboard player is unavailable.
- Removed the crew-schedule playback claim because the feed comes from an external camera. Verified NASA's embed source and confirmed that YouTube identifies the replacement as NASA's public stream.

### Tonight near you

- Added a location-based dashboard panel that combines planets above the horizon during darkness, the next moonrise in the coming 24 hours, the next predicted visible ISS pass, and an aurora estimate based on the latest valid Kp reading. It brings observing conditions together without adding a provider or requiring a new API key.
- Updated the dashboard's astronomical calculations to support times other than the present, and reused the ISS pass request for the panel and the existing pass list. Times in the new panel are shown in UTC.
- Verified the dashboard script parses and tested the panel with fixed dates, locations, and mocked ISS responses. Production verification is pending.

### Dashboard feeds

- Updated the dashboard ISS tracker to use the public Where the ISS at? feed with N2YO as a fallback. It shows measured values when available and labels retained coordinates as last known.
- Updated launch countdowns to respect the provider’s status and time precision. An expired target time now shows “Awaiting update” until the provider confirms liftoff.
- Replaced placeholder space-weather measurements with NOAA observations and timestamps. Local aurora visibility is labeled as an estimate.
- Replaced hard-coded news with direct article links from the existing feed. Failed refreshes retain the last successful results for the open session.
- Paused dashboard feed polling in hidden tabs to reduce unnecessary requests.
- Added a README explaining the project, how to preview it locally, which feeds require server-side keys, and how to roll back a release.

Verified JavaScript syntax and exercised successful, invalid, and failed responses with mocked data. Live deployment verification is pending.

### Rollback

If the update has been merged, use GitHub’s **Revert** action on the merged pull request and merge the resulting revert pull request. This records the rollback in the commit history. If the update is still under review, close the pull request to keep it off the default branch.
