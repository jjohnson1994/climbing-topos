# Climbing Topos — Feature Specification

## Area Editing

### Access
- Only the crag admin (the user whose `sub` matches `crag.managedBy.sub`) can edit an area
- Unauthenticated users visiting the edit URL are redirected to `/login`
- Authenticated non-admin users visiting the edit URL are redirected back to the area page
- The "Edit Area" button is only rendered on the area page when the current user is the crag admin

### Editable Fields
- **Title** — free text, replaces the existing area title
- **Description** — free text, replaces the existing area description
- **Access** — one of: `unknown`, `permitted`, `restricted`, `banned`
- **Rock Type** — one of the supported rock types (Gritstone, Limestone, Plastic, Sandstone, Tuff, Wood)
- **Tags** — multi-select from the defined area tag list; individual tags can be added or removed independently of one another

### Behaviour
- If the user submits the form with no changes, they are navigated back to the area page without making a network request
- On successful save the area page data is refreshed and the user is navigated back to the area page
- On failure an error popup is shown and the user remains on the edit page

### Security
- The server action re-validates admin ownership server-side regardless of what the UI presents
- Non-admin requests to the patch endpoint are rejected with a permission error

---

## Route Details Page

### Layout
- The route details page is split into two tabs: **Details** and **Stats**
- Tabs are implemented as nested routes (`/routes/$routeSlug/` and `/routes/$routeSlug/stats`), not UI state or search params
- The **Details** tab is the default — navigating to `/routes/$routeSlug/` renders it automatically
- The **Stats** tab is only shown when the route has at least one log (`logCount > 0`)
- Tab links use `preload="intent"` so the tab's loader starts on hover
- The active tab link carries `aria-current="page"` for accessibility
- The layout (header, tab nav) is shared across tabs and the edit page via a parent layout route

### Header (visible on all tabs)
- Displays route title, grade label (converted from `gradeModal` + `gradingSystem`), route type, and star rating
- Displays route description with whitespace preserved
- Tags and verification status (`Awaiting Verification`) are shown when present
- **Log Route** and **Save to List** action buttons are always visible in the header
- The **Edit Route** button is shown only when the current user is the crag admin
- Breadcrumb links navigate back to the crag and area pages

---

## Route Details Tab

### Content
- Displays the topo image with the current route's drawing highlighted and sibling routes overlaid
- If the route has no drawing, the topo image section is omitted
- Lists all other routes on the same topo with their grade and type; the current route is shown in bold
- Displays all logs for the route via the log list component

---

## Route Stats Tab

### Access
- Only visible when `route.logCount > 0`
- Navigating to `/stats` when there are no logs shows an empty state message

### Summary Stats (stat cards)
- **Total Logs** — the value of `route.logCount`
- **Avg Rating** — mean rating computed from `route.ratingTally`, displayed as `X.X / 5`; shown as `N/A` when no ratings exist
- **Most Logged Grade** — the grade label corresponding to `route.gradeModal`; omitted if unavailable
- **Unique Climbers** — count of distinct user `sub` values across all logs; omitted if zero

### Charts
- **Grade Distribution** — bar chart of logged grade counts from `route.gradeTally`, sorted by grade value ascending
- **Ratings** — bar chart of counts per star rating (1–5) from `route.ratingTally`; only shown when at least one rating exists
- **When People Climb It** — bar chart of log counts aggregated by calendar month (Jan–Dec) across all years, showing seasonal patterns; only shown when log date data is present
- **Activity Over Time** — area chart of log counts per calendar month in chronological order; only shown when logs span more than one month

### Data sources
- Grade and rating distributions are computed from the route object (`gradeTally`, `ratingTally`) loaded by the layout
- Monthly and timeline data are computed from the full log list fetched by the stats tab's own loader

---

## User Profile Dashboard

### Layout
- The profile page is split into three tabs: **Stats**, **Logs**, and **Lists**
- Tabs are implemented as nested routes (`/profile/stats`, `/profile/logs`, `/profile/lists`), not UI state or search params
- Navigating to `/profile` redirects to `/profile/stats` as the default tab
- Tab links use `preload="intent"` so the tab's loader starts on hover
- The active tab link carries `aria-current="page"` for accessibility
- The profile header is shared across all tabs via a parent layout route

### Access
- Unauthenticated users visiting any `/profile/*` URL are redirected to `/login`

### Header (visible on all tabs)
- Displays the user's profile picture, nickname, total climbs logged, and number of crags visited
- A **Logout** button is always visible in the header

### Stats Tab (`/profile/stats`)
- Displays summary stat cards: Climbs Logged, Crags Visited, Avg Rating, Favourite Style
- Charts:
  - **Activity Over Time** — area chart of climbs logged per month in chronological order
  - **Grade Distribution** — bar chart of the top 12 most-logged grades sorted by grade value
  - **Route Types** — donut pie chart of climb counts by route type
  - **Top Crags** — bar chart of the top 8 most-visited crags by log count
  - **Ratings Given** — bar chart of 1–5 star rating distribution across all logs
- All data is derived from the user's full log list loaded by the layout

### Logs Tab (`/profile/logs`)
- Displays the user's full climbing log list
- Data is derived from the user's full log list loaded by the layout

### Lists Tab (`/profile/lists`)
- Displays the user's saved route lists
- List data is fetched client-side by the component independently of the layout loader

---

## Crag Page — Routes Tab

### Layout
- The Routes tab displays all routes across all areas of the crag in a TanStack Table v8 powered table
- The table is preceded by a filter/group control panel in a box

### Filter Controls
- **Search** — always visible; fuzzy text search across route title, area name, and grade label using `@tanstack/match-sorter-utils`; clears automatically when empty
- **Filter by type** — tag pills for each distinct route type present in the crag; clicking a pill toggles it; multiple types can be selected simultaneously; active pills are highlighted; hidden when only one type exists
- **Filter by area** — tag pills for each distinct area; clicking a pill toggles it; multiple areas can be selected; active pills are highlighted; hidden when only one area exists
- **Clear filters** button — shown when any filter is active; resets search, type, and area filters

### Grouping Controls
- Tag pills to group by: **Area**, **Type**, **Grade**, **Rating**; only one grouping can be active at a time; clicking the active grouping deactivates it
- When grouped, rows are collapsed into group header rows showing the group value and sub-row count; clicking a group header toggles expand/collapse
- All groups are expanded by default
- When grouped by a column, that column is hidden from individual route rows to avoid repetition
- Grade groups are ordered by difficulty (numeric `gradeModal` value), not alphabetically
- Rating groups show star icons in the group header rather than the raw numeric value

### Table Columns
- **Route** — route title as a link to the route detail page; logged routes are shown with strikethrough
- **Area** — only shown when the crag has more than one area and grouping is not active on area
- **Grade** — grade label derived from `gradeModal` + `gradingSystem`; included in fuzzy search
- **Type** — route type; only shown when the crag has more than one route type and grouping is not active on type
- **Rating** — star rating display
- **Ticks** — log count

### Sorting
- All columns are sortable by clicking the column header; sort direction cycles ascending → descending → none
- An icon indicates the current sort direction; unsorted sortable columns show a neutral sort icon
- When a search is active, results are sorted by fuzzy match rank (best match first), falling back to alphanumeric

### Row Count
- A count below the table shows total routes, or filtered count vs total when filters are active

---

## Topo Editing

### Access
- Only the crag admin can edit a topo
- Unauthenticated users visiting the edit URL are redirected to `/login`
- Authenticated non-admin users visiting the edit URL are redirected back to the area page
- An "Edit Topo" button is rendered next to each topo on the area page only when the current user is the crag admin

### Editable Fields
- **Orientation** — compass direction the crag face looks toward; one of: `unknown`, `north`, `north-east`, `east`, `south-east`, `south`, `south-west`, `west`, `north-west`
- **Image** — optional replacement for the existing topo photo

### Image Replacement
- The current topo image is displayed while editing
- The user may optionally select a new image file to replace it
- After selecting a file the new image is previewed before saving
- The user can crop the selected image before saving
- The user can flip the selected image horizontally or vertically before saving
- Images are compressed client-side to a maximum of 2000×2000 before upload
- On save the new image is uploaded to S3, converted to WebP, and the topo record is updated with the new CDN URL
- The previous S3 object is deleted after the new image is successfully uploaded
- If no new image is selected the existing image is preserved unchanged

### Behaviour
- If the user submits the form with no changes (no orientation change, no new image) they are navigated back to the area page without making a network request
- On successful save the area page data is refreshed and the user is navigated back to the area page
- On failure an error popup is shown and the user remains on the edit page
- The save button is disabled while image compression is in progress

### Security
- The server action re-validates admin ownership server-side regardless of what the UI presents
- Non-admin requests to the patch endpoint are rejected with a permission error
- Image deletion can only be triggered by an authenticated crag admin (the delete occurs after the permission check)
