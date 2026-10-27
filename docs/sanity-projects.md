# Manage Selected Work in Sanity

Selected Work now reads published `project` documents from your new Sanity project **ttil6cux**, dataset **production**. The photo journal continues to use the existing project configured in `NEXT_PUBLIC_SANITY_PROJECT_ID`.

## Start your new Studio

A standalone Studio is provided in `studio/`, with the Project schema registered already.

```bash
npm --prefix studio run dev
```

Open the printed URL (normally http://localhost:3333) and sign in with the Sanity account that owns the project. If Studio asks for permission to use the origin, allow localhost for this Studio in your Sanity project's API/CORS settings. You should see **Project** in the left sidebar.

For access beyond your local computer, run `npm --prefix studio run deploy` and follow the Studio hosting prompts. This is separate from the Vercel portfolio deployment. No Studio has been deployed by this change.

## Portfolio environment configuration

Keep the photo variables unchanged. Add these server-side values to the portfolio's `.env.local` and to Vercel Production (Preview too if desired):

```env
SANITY_WORK_PROJECT_ID=ttil6cux
SANITY_WORK_DATASET=production
```

The local `.env.local` has been updated. Redeploy Vercel after adding the variables there. Once configured, publishing content does not need a portfolio rebuild. No API token is needed for reading this public dataset. If the dedicated variables are absent, Selected Work falls back to the original Sanity project configuration for backwards compatibility.

The Project schema lives in `studio/schemaTypes/project.js`. To reuse it in a Studio maintained elsewhere, copy that file and register its exported `project` type in that Studio's schema array.

## Add the projects

Create a Project document for each app, enter its details, and click Publish. Set lower display order numbers for entries you want first. Image is optional: without it, the website creates a Signal-style initial graphic automatically. Uploaded images have hotspot/crop support and alternative text.

Suggested initial entries:

| Title | Live app URL | Category | Display order |
| --- | --- | --- | --- |
| Stride Pace Converter | https://stride-pace-converter.kindplum13.chatgpt.site/ | Running tool | 0 |
| URL Shortener | https://url-shortener.abdussamadyisau.xyz/ | Web app | 1 |
| Frontend Practice | https://frontend-practice-two.vercel.app/ | Interface experiments | 2 |
| Tag Africa | https://www.tag-africa.org/ | Professional services / Website | 3 |
| Dictionary | https://dictionary.abdussamadyisau.xyz | Personal project / Web app | 4 |

Add a short description, and optionally a year and screenshot. Titles, descriptions, categories, URLs, ordering, years, and images all come from Sanity. You do not have to change the portfolio source for new entries.

## Publishing behavior

- Only published `project` documents with a title and valid HTTP(S) URL are displayed. Photo and starter blog documents are excluded.
- Once there is at least one valid published project, the CMS list replaces the bundled starter list. Publish all entries you want to keep in that list.
- Before initial setup, when the CMS list is empty, or if the first request fails, the bundled five projects remain visible. An intentional completely empty CMS list also uses that starter list; hide the section in code if you want no projects at all.
- After successful loading, a temporary fetch error retains the last displayed list. The page checks for changes every minute, with additional CDN caching possible. Refreshing or waiting is enough for content updates; no Vercel rebuild is required.
- The navigation project count updates from the displayed list.

Existing app URLs are preserved. No redirects or asset migration are needed for this small content move. No documents have been written to Sanity by this implementation.
