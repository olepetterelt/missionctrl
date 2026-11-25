# Changelog

## 2026-11-25

- Updated the dashboard ISS tracker to use the public Where the ISS at? feed with N2YO as a fallback. It shows measured values when available and labels retained coordinates as last known.
- Updated launch countdowns to respect the provider’s status and time precision. An expired target time now shows “Awaiting update” until the provider confirms liftoff.
- Replaced placeholder space-weather measurements with NOAA observations and timestamps. Local aurora visibility is labeled as an estimate.
- Replaced hard-coded news with direct article links from the existing feed. Failed refreshes retain the last successful results for the open session.
- Paused dashboard feed polling in hidden tabs to reduce unnecessary requests.

Verified JavaScript syntax and exercised successful, invalid, and failed responses with mocked data. Live deployment verification is pending.

### Rollback

If the update has been merged, use GitHub’s **Revert** action on the merged pull request and merge the resulting revert pull request. This records the rollback in the commit history. If the update is still under review, close the pull request to keep it off the default branch.
