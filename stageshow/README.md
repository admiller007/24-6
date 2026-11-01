# Before and after (Stageshow source)

Source for `/compare/`, built with the Stageshow skill's kit
(https://github.com/benjitaylor/skills, `stageshow/`).

- `examples/locks-slider`: drag-to-compare on the top of the page (desktop window and phone)
- `examples/locks-whole`: the whole page, old beside new, scrolling in step
- `examples/locks-assets`: the screenshots both use
- `site`: the host page that `/compare/` is built from

To rebuild: clone the skills repo, copy these folders into its `stageshow/`
folder, run `npm install` there, then
`node node_modules/vite/bin/vite.js build --config site/vite.config.ts`
(the config writes to `/home/user/24-6/compare`; change `outDir` to suit).
`?record=slider-wide` (or `slider-phone`, `whole-wide`, `whole-phone`) on the
built page renders one stage on the kit's virtual clock for frame-by-frame
video capture.
