[![Deploy to GitHub Pages](https://github.com/SOliv1/Daily-Reflections-App/actions/workflows/deploy.yml/badge.svg)](https://github.com/SOliv1/Daily-Reflections-App/actions/workflows/deploy.yml)

# Daily Reflections App

Daily Orb Reflections is a React app that shows a daily reflection, matching
image, mood, and favourites saved in the browser.

Live app:
[https://soliv1.github.io/Daily-Reflections-App/](https://soliv1.github.io/Daily-Reflections-App/)

## Testing App: 
 view [here](https://github.com/SOliv1/daily-reflections-testing-app)
 View Live App [here](https://soliv1.github.io/daily-reflections-testing-app/)

### Run Locally

Install dependencies first:

```bash
npm install
```

Start the local app:

```bash
npm start
```

Open the local URL shown in the terminal. It is usually:

```text
http://localhost:3000
```

If port `3000` is already in use, React may offer another port such as
`3001`.

## Content Testing Page

Use the Testing page whenever you update quotes, images, moods, daily
reflections, favourites, or a new content suite/theme.

Local URL:

```text
http://localhost:3000/testing
```

If the app is running on a different port, change the port in the URL:

```text
http://localhost:3001/testing
```

You can also open the app and click **Testing** in the header.

## What To Check On The Testing Page

### Daily Rotation

The Daily Rotation section shows the seven reflections used by the Today page.
Each card links to a preview date, so you can manually check what appears on
each day of the week.

Important: the Today page currently uses JavaScript `date.getDay()`, so the
daily rotation uses only the first seven reflections in `src/data/reflections.js`.
Items after the first seven are shown in the content library but are marked as
`Library only` unless the rotation logic changes.

### All Reflections

The All Reflections section is the main content QA board. Use it to check:

- each image renders correctly
- each quote matches the intended image
- each title, mood, and source path are correct
- whether an item is in the daily rotation or only in the library
- whether a reflection can be saved as a favourite

Each card shows the image path, for example:

```text
/images/reflections1.png
```

Use that path to confirm the matching file exists in `public/images`.

### Mood Filter

Use the Mood filter to review one content theme at a time. This is useful when
adding a new suite or checking whether a group of reflections feels consistent.

### Favourites Persistence

The Favourites Persistence section uses the same browser `localStorage` key as
the real Favourites page:

```text
favourites
```

To test persistence manually:

1. Open `/testing`.
2. Click **Save** on one or more reflection cards.
3. Check that the saved IDs appear in the Favourites Persistence section.
4. Click **Favourites page**.
5. Confirm the saved reflections appear there.
6. Refresh the browser.
7. Confirm the favourites are still saved.
8. Return to `/testing` and use **Clear** when you want to reset the saved list.

## Preview A Specific Daily Reflection

The Today page supports a date query parameter for manual testing:

```text
http://localhost:3000/today?date=2026-05-20
```

This lets you preview a specific day without changing your computer clock.

Example preview dates:

- Sunday: `/today?date=2026-05-17`
- Monday: `/today?date=2026-05-18`
- Tuesday: `/today?date=2026-05-19`
- Wednesday: `/today?date=2026-05-20`
- Thursday: `/today?date=2026-05-21`
- Friday: `/today?date=2026-05-22`
- Saturday: `/today?date=2026-05-23`

## Updating Reflections

Reflection content lives in:

```text
src/data/reflections.js
```

Images live in:

```text
public/images
```

When adding or updating a reflection, check that each item has:

- `id`
- `title`
- `line`
- `mood`
- `image`

After editing, open `/testing` and confirm:

- the image loads
- the image matches the quote
- the mood/theme is correct
- the item appears in the expected daily/library group
- saving and removing favourites still works

## Automated Tests

Run all automated tests:

```bash
npm test -- --watchAll=false
```

The tests currently cover:

- the home page render
- daily reflection data validity
- daily image file existence
- Today page date previews
- favourites persistence through `localStorage`
- the Testing page content board and mood filter

## Production Build

Before deploying, run:

```bash
npm run build
```

This confirms the production bundle compiles successfully.

## Deployment

This app is configured for GitHub Pages using the `homepage` field in
`package.json`.

Build output is created in:

```text
build
```
