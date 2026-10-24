// ---------------------------------------------------------------------------
// The collection. Swap these 100 demo photographs for your own by editing the
// `photos` array at the bottom of this file (or by pointing `src` / `full` at
// files you drop in `public/photos/`). See README.md for both options.
// ---------------------------------------------------------------------------

const TAGS = [
  'Nature',
  'Architecture',
  'Travel',
  'People',
  'Abstract',
  'Animals',
  'Food',
  'City',
]

const AUTHORS = [
  '@mara.k',
  '@jonasv',
  '@inna_li',
  '@theo.t',
  '@ravi',
  '@solene',
  '@kaior',
  '@nadia',
]

// Varied heights are what give the pinboard its staggered rhythm.
const HEIGHTS = [720, 900, 640, 1080, 800, 560, 960, 700, 840, 620]

const TITLES = [
  'Quiet hinge',
  'Salt and stone',
  'Long afternoon',
  'Soft geometry',
  'The far side',
  'Low tide',
  'Paper light',
  'Northbound',
  'Hold still',
  'A slower street',
  'Copper hours',
  'First frost',
  'Window seat',
  'Blue interval',
  'Between trees',
  'Small weather',
  'Late return',
  'Open water',
  'Half remembered',
  'Warm concrete',
  'After the rain',
  'Night market',
  'Glass and dust',
  'The long way',
  'Folded sky',
  'Morning shift',
  'Bare branches',
  'Distant bells',
  'Edge of town',
  'Almost still',
]

const WIDTH = 600

const pad = (n) => String(n).padStart(3, '0')

/** Build one deterministic demo photo. */
function makePhoto(i) {
  const seed = `lumen-${i + 1}`
  const height = HEIGHTS[i % HEIGHTS.length] + (i % 3) * 40
  const tag = TAGS[i % TAGS.length]
  const title = `${TITLES[i % TITLES.length]} ${pad(i + 1)}`

  return {
    id: i + 1,
    seed,
    title,
    tag,
    author: AUTHORS[i % AUTHORS.length],
    width: WIDTH,
    height,
    // Grid-sized image (kept modest so 100 of them stay fast).
    src: `https://picsum.photos/seed/${seed}/${WIDTH}/${height}`,
    // High-resolution version used by the lightbox zoom.
    full: `https://picsum.photos/seed/${seed}/1400/${Math.round(
      (height * 1400) / WIDTH,
    )}`,
    alt: `${tag} photograph titled ${title}`,
  }
}

export const photos = Array.from({ length: 100 }, (_, i) => makePhoto(i))

export const tags = TAGS
