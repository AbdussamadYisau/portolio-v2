# Connect the portfolio

The music card and running panel are implemented, but live data needs your accounts. No sample listening or running statistics are presented as real activity.

## Spotify

1. Create an app at https://developer.spotify.com/dashboard (development mode currently requires the app owner to have Spotify Premium). Select Web API and register this exact redirect URI: `http://127.0.0.1:4387/callback`.
2. Copy `.env.example` to `.env.local` if that file does not already exist. Fill in `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` locally. Do not share these in chat or commit them.
3. Run `node scripts/connect-spotify.mjs` with Node 20.12 or newer. Open the URL it prints and approve access to your currently playing and recently played tracks. Only connect the Spotify account whose listening activity you want shown publicly on your portfolio.
4. The helper validates the OAuth state and saves the refresh token directly to ignored `.env.local` without printing it. Restart `npm run dev`.
5. Play a song. The card polls every 30 seconds while the page is visible. Paused playback is labelled “Last listened”; with no current track it requests the most recently played track. When no data is available, it shows a quiet state.

`/api/spotify` exposes only display metadata, never account credentials or device information. Server-side token reuse, a 30-second response cache, concurrent request deduplication, timeouts, and rate-limit backoff reduce upstream requests. Caches are per server instance. Anyone visiting the portfolio can see the returned track metadata. Disconnect by revoking access in Spotify’s connected apps and removing the environment variables.

For deployment, add the three Spotify variables to your host’s server-side environment settings. Do not add a `NEXT_PUBLIC_` prefix. The local helper needs to run only for initial authorization or reconnection; no authorization callback is exposed by the deployed portfolio.

## Strava

1. On the Strava website, open your profile and choose **Share your Activities** below the stats. Choose the recent runs or weekly summary embed. Set running as your default sport if necessary.
2. Copy the exact `src` URL from the official iframe code into `NEXT_PUBLIC_STRAVA_EMBED_URL` in `.env.local`. Add your profile URL as `NEXT_PUBLIC_STRAVA_PROFILE_URL`. Do not paste an entire HTML snippet into the URL setting or construct a URL from your athlete ID.
3. Restart the dev server. The running panel displays the embed automatically when it approaches the viewport. These public settings must also be configured at build time on your deployment host.

Only HTTPS embeds on `strava.com`, `www.strava.com`, and `strava-embeds.com` are accepted. The page loads third-party content on click and always shows a configured profile link as a fallback. Strava controls the embedded layout and activity visibility; it does not inherit this portfolio’s font or theme. If your official embed uses a placeholder plus script instead of an iframe, send that public snippet so the integration can be adapted to that format.

The official embed is used instead of republishing data from the Strava API, whose public-display restrictions apply to API integrations.

Sources: [Spotify authorization](https://developer.spotify.com/documentation/web-api/tutorials/code-flow), [recently played](https://developer.spotify.com/documentation/web-api/reference/get-recently-played), [Strava embeds](https://support.strava.com/en-us/articles/15402053-sharing-your-activities-and-routes-with-a-strava-embed).

## Verification

Run `node --test lib/spotify.test.mjs` and `npm run build -- --webpack`. Actual account playback and Strava rendering require the configuration above.

## Running card appearance

The running panel displays the official Strava iframe directly, with lazy loading. The surrounding heading, paper background, border, and offset shadow follow the portfolio’s Signal styling. `data/running.json` is no longer used by the website.

The iframe’s internal fonts, colors, buttons, and layout cannot be changed with this site’s CSS. Use Strava’s embed generator for any appearance settings available for your chosen embed type. Keep the iframe at a readable size; do not crop out attribution or controls. The profile link below the embed remains available if third-party content cannot load.

## Recent listening and playback

The Spotify card displays the four latest listening entries in a 2×2 grid in Spotify’s returned order, including repeat plays. It refreshes every 30 seconds while visible. The API exposes a `recentTracks` array with title, artist, album, image, Spotify URL, and played-at timestamp. If history access fails, currently playing content can still display. The existing authorization helper already requests `user-read-recently-played`; reconnect if your token predates that scope.

The most recently listened track loads in Spotify’s official player. Playback starts only when the visitor presses play in the embedded player or the ten-second listen button. Scrolling and player readiness never start playback. The ten-second button seeks to zero; playback pauses when Spotify reports 10 seconds of playback position or when the tab is hidden. Spotify can restrict playback to a supplied preview excerpt, so this does not guarantee the first ten seconds of the original recording. No audio is downloaded or cut into a new file.

## Through my lens — Sanity photo journal

The portfolio reads published `picture` documents from your connected public dataset using `/api/pictures`. Starter `post` and `author` documents are excluded. Publish each picture in Studio after uploading it; an asset upload or a saved draft alone does not make a gallery entry.

The gallery uses your existing fields: `title`, `image`, and `image.alt`. Optional `caption`, `location` (text), and `displayOrder` (number) are supported if you add them to your Studio schema. Entries sort by display order, then newest creation date, with a maximum of 12 photos. Enable `hotspot: true` in the Studio image field if you add cropping controls. Images retain their proportions and use Sanity’s image URL builder for resizing and format optimization.

Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to `.env.local` and your deployment environment. No API token is needed for published content in a public dataset. The portfolio proxies reads through its own API route, so frontend requests do not require an additional Sanity CORS origin. Published changes appear after refreshing or the gallery’s 60-second refresh cycle, subject to CDN caching. New deployment environment values require a restart/redeployment.

Click a photo to open a larger view; Escape, the close button, or clicking the backdrop closes it. The gallery shows loading, empty, and retry states when appropriate. This integration reads content and does not modify the Studio or published documents.
