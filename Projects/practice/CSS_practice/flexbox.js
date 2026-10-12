const controls = document.querySelector("#flex-controls");
const gallery = document.querySelector("#animal-gallery");
const previewPanel = document.querySelector("#preview-panel");
const cards = [...gallery.querySelectorAll(".animal-card")];
const cssOutput = document.querySelector("#css-output");
const behaviorOutput = document.querySelector("#behavior-output");
const previewExplanation = document.querySelector("#preview-explanation");
const inlineContextNote = document.querySelector("#inline-context-note");

const displayDescriptions = {
  flex: "display: flex makes the gallery a block-level flex container: it fills the available row, so neighboring content starts below it.",
  "inline-flex":
    "display: inline-flex makes the gallery an inline-level flex container: it sizes around its contents and can share a line with neighboring content. The cards inside still use Flexbox.",
};

const alignDescriptions = {
  stretch: "Items stretch to fill available cross-axis space.",
  "flex-start": "Items line up at the start of the cross axis.",
  "flex-end": "Items line up at the end of the cross axis.",
  center: "Items line up in the center of the cross axis.",
  baseline: "Items align their text baselines.",
  auto: "The first card follows the container's align-items setting.",
};

const expectedBehaviors = {
  display: (get) =>
    get("display") === "inline-flex"
      ? "The gallery becomes inline-sized, allowing neighboring content to sit beside it."
      : "The gallery fills its row, so neighboring content starts below it.",
  direction: (get) =>
    get("direction").includes("column")
      ? `Cards stack ${get("direction") === "column" ? "top to bottom" : "bottom to top"}; the main axis is vertical, so justify-content moves them vertically.`
      : `Cards flow ${get("direction") === "row" ? "left to right" : "right to left"}; the main axis is horizontal, so justify-content moves them horizontally.`,
  wrap: (get) =>
    get("wrap") === "nowrap"
      ? "All cards stay on one line and may overflow the preview."
      : `Cards can wrap ${get("wrap") === "wrap-reverse" ? "in reverse cross-axis order" : "onto new lines"}.`,
  justify: (get) => {
    const effects = {
      "flex-start": "Cards gather at the start",
      "flex-end": "Cards gather at the end",
      center: "Cards gather in the center",
      "space-between": "Free space goes between cards",
      "space-around": "Free space goes around cards",
      "space-evenly": "Free space is evenly distributed",
    };
    const axis = get("direction").includes("column") ? "column" : "row";
    const growth =
      get("grow") === "0"
        ? "flex-grow 0 leaves free space visible."
        : "Set flex-grow to 0 to see the spacing.";
    return `${effects[get("justify")]} along the ${axis}; ${growth}`;
  },
  alignItems: (get) =>
    `Different-height cards align at ${get("alignItems")} across each row.`,
  alignContent: (get) =>
    `Multiple rows are positioned at ${get("alignContent")} in the gallery.`,
  gap: (get) => `The space between cards and rows is ${get("gap")}.`,
  grow: (get) =>
    get("grow") === "0"
      ? "Cards keep their basis width, leaving free space for justify-content."
      : `Cards grow to use extra row space (flex-grow: ${get("grow")}).`,
  shrink: (get) =>
    get("shrink") === "0"
      ? "Cards refuse to shrink and may overflow when the row is crowded."
      : "Cards can shrink to fit when the row is crowded.",
  basis: (get) => `Each card starts at a flex-basis of ${get("basis")}.`,
  order: (get) =>
    get("order") === "0"
      ? "Sunny stays in its original position."
      : `Sunny moves to order ${get("order")}; lower order values appear first.`,
  alignSelf: (get) =>
    `Sunny aligns at ${get("alignSelf")} independently of the other cards.`,
};

function updatePreview(event) {
  const values = new FormData(controls);
  const get = (name) => values.get(name);

  gallery.style.display = get("display");
  gallery.style.flexDirection = get("direction");
  gallery.style.flexWrap = get("wrap");
  gallery.style.justifyContent = get("justify");
  gallery.style.alignItems = get("alignItems");
  gallery.style.alignContent = get("alignContent");
  gallery.style.gap = get("gap");
  gallery.classList.toggle("is-inline-flex", get("display") === "inline-flex");
  inlineContextNote.hidden = get("display") !== "inline-flex";

  for (const card of cards) {
    card.style.flexGrow = get("grow");
    card.style.flexShrink = get("shrink");
    card.style.flexBasis = get("basis");
  }

  cards[0].style.order = get("order");
  cards[0].style.alignSelf = get("alignSelf");

  const orderDescription =
    get("order") === "0"
      ? "Sunny stays in its natural position."
      : `Sunny moves to order ${get("order")}; lower order values appear first.`;

  const changedControl = event?.target?.name;
  behaviorOutput.textContent = expectedBehaviors[changedControl]
    ? expectedBehaviors[changedControl](get)
    : expectedBehaviors.justify(get);

  previewExplanation.textContent = [
    `${displayDescriptions[get("display")]} flex-direction: ${get("direction")} means ${get("direction").includes("column") ? "cards stack vertically" : "cards line up horizontally"}.`,
    `With flex-wrap: ${get("wrap")}, ${get("wrap") === "nowrap" ? "cards stay on one line and may overflow" : "cards can move onto additional lines"}.`,
    `justify-content: ${get("justify")} positions cards along the main axis; align-items: ${get("alignItems")} positions differently sized cards across it. The short, medium, and tall photo cards make center and flex-end easy to compare. align-content: ${get("alignContent")} positions rows when there is extra cross-axis space.`,
    `Each card uses flex: ${get("grow")} ${get("shrink")} ${get("basis")}, with a ${get("gap")} gap. ${orderDescription} align-self: ${get("alignSelf")} controls Sunny's individual alignment.`,
  ].join(" ");

  cssOutput.textContent = [
    `.animal-gallery {`,
    `  display: ${get("display")};`,
    `  flex-direction: ${get("direction")};`,
    `  flex-wrap: ${get("wrap")};`,
    `  justify-content: ${get("justify")};`,
    `  align-items: ${get("alignItems")};`,
    `  align-content: ${get("alignContent")};`,
    `  gap: ${get("gap")};`,
    `}`,
    ``,
    `.animal-card {`,
    `  flex: ${get("grow")} ${get("shrink")} ${get("basis")};`,
    `}`,
    ``,
    `.animal-card--short .animal-photo { height: 140px; }`,
    `.animal-card--medium .animal-photo { height: 205px; }`,
    `.animal-card--tall .animal-photo { height: 270px; }`,
    ``,
    `.animal-card:first-child {`,
    `  order: ${get("order")};`,
    `  align-self: ${get("alignSelf")};`,
    `}`,
  ].join("\n");
}

controls.addEventListener("change", updatePreview);
controls.addEventListener("reset", () => {
  previewPanel.style.width = "";
  previewPanel.style.height = "";
  requestAnimationFrame(updatePreview);
});

const previewResizeObserver = new ResizeObserver(([entry]) => {
  const { width, height } = entry.contentRect;
  const widthEffect =
    width < 620
      ? "Cards wrap into more rows."
      : "Cards have more room across each row.";
  const heightEffect =
    height < 600
      ? " Fewer rows fit vertically, so scroll inside the preview."
      : " More rows fit vertically.";
  behaviorOutput.textContent = `Preview resized to ${Math.round(width)} × ${Math.round(height)}px. ${widthEffect}${heightEffect}`;
});
previewResizeObserver.observe(previewPanel);

for (const card of cards) {
  card.classList.remove("is-target");
}
cards[0].classList.add("is-target");
updatePreview();
