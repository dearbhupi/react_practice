const controls = document.querySelector("#flex-controls");
const gallery = document.querySelector("#animal-gallery");
const wordGallery = document.querySelector("#word-gallery");
const previewPanel = document.querySelector("#preview-panel");
const cards = [...gallery.querySelectorAll(".animal-card")];
const wordPieces = [...wordGallery.querySelectorAll(".word-piece")];
const galleryCount = document.querySelector("#gallery-count");
const cssOutput = document.querySelector("#css-output");
const behaviorOutput = document.querySelector("#behavior-output");
const previewExplanation = document.querySelector("#preview-explanation");
const wordTip = document.querySelector("#word-tip");
const inlineContextNote = document.querySelector("#inline-context-note");

const displayDescriptions = {
  flex: "The big box stretches across its row, so the next thing starts below it.",
  "inline-flex":
    "The big box hugs its contents and can share a line with a neighbor.",
};

const wordTips = {
  display: "Watch the word playground's big box change how it sits on the page.",
  direction: "Try changing the direction: the word train can go across or stack up!",
  wrap: "Try wrap: the word cards can hop onto a new line when they run out of room.",
  justify: "Try each choice: it moves the word train along its line or stack.",
  alignItems: "Try each choice: it lines the word cards up across their line.",
  alignContent: "When there are several lines, this moves the lines around together.",
  gap: "Try a bigger gap: the word cards get more breathing room!",
  grow: "Try a bigger grow number: the word cards stretch to fill spare room.",
  shrink: "Make the preview narrow to see if the word cards can squeeze smaller.",
  basis: "Try a new starting size and watch the word cards change width.",
  order: "Move the first word card to a new spot in the train.",
  alignSelf: "Move just the first word card across its line.",
};

const expectedBehaviors = {
  display: (get) =>
    get("display") === "inline-flex"
      ? "The big box hugs its contents and can share a line with a neighbor."
      : "The big box stretches across its row; the next thing starts below.",
  direction: (get) =>
    get("direction").includes("column")
      ? `Items make a ${get("direction") === "column" ? "top-to-bottom" : "bottom-to-top"} stack.`
      : `Items make a ${get("direction") === "row" ? "left-to-right" : "right-to-left"} line.`,
  wrap: (get) =>
    get("wrap") === "nowrap"
      ? "All items stay in one line, even if they run out of room."
      : `Items can move onto new lines${get("wrap") === "wrap-reverse" ? " in reverse order" : ""}.`,
  justify: (get) => {
    const effects = {
      "flex-start": "Items gather at the start",
      "flex-end": "Items gather at the end",
      center: "Items gather in the middle",
      "space-between": "Extra space goes between items",
      "space-around": "Extra space goes around items",
      "space-evenly": "Extra space is shared evenly",
    };
    const axis = get("direction").includes("column") ? "stack" : "line";
    const growth = get("grow") === "0" ? "" : " Set grow to 0 to see the spacing.";
    return `${effects[get("justify")]} along the ${axis}.${growth}`;
  },
  alignItems: (get) =>
    `Items line up across the row using “${get("alignItems")}”.`,
  alignContent: (get) =>
    `Rows of items gather using “${get("alignContent")}”.`,
  gap: (get) => `There will be ${get("gap")} of space between items.`,
  grow: (get) =>
    get("grow") === "0"
      ? "Items stay their starting size, leaving room to spread them out."
      : `Items grow to fill extra room (grow: ${get("grow")}).`,
  shrink: (get) =>
    get("shrink") === "0"
      ? "Items won't squeeze smaller, so they may spill out."
      : "Items can squeeze smaller to fit.",
  basis: (get) => `Each item starts at ${get("basis")} wide.`,
  order: (get) =>
    get("order") === "0"
      ? "The first item stays in its usual place."
      : `The first item moves to spot ${get("order")}.`,
  alignSelf: (get) =>
    `The first item lines up by itself using “${get("alignSelf")}”.`,
};

function updatePreview(event) {
  const values = new FormData(controls);
  const get = (name) => values.get(name);
  const isColumn = get("direction").includes("column");
  const wordBasis = isColumn
    ? get("basis") === "40%"
      ? "60px"
      : `${Math.round(Number.parseFloat(get("basis")) / 4)}px`
    : get("basis");

  gallery.style.display = get("display");
  gallery.style.flexDirection = get("direction");
  gallery.style.flexWrap = get("wrap");
  gallery.style.justifyContent = get("justify");
  gallery.style.alignItems = get("alignItems");
  gallery.style.alignContent = get("alignContent");
  gallery.style.gap = get("gap");
  gallery.classList.toggle("is-inline-flex", get("display") === "inline-flex");
  inlineContextNote.hidden = get("display") !== "inline-flex";

  wordGallery.style.display = get("display");
  wordGallery.style.flexDirection = get("direction");
  wordGallery.style.flexWrap = get("wrap");
  wordGallery.style.justifyContent = get("justify");
  wordGallery.style.alignItems = get("alignItems");
  wordGallery.style.alignContent = get("alignContent");
  wordGallery.style.gap = get("gap");
  wordGallery.classList.toggle("is-column", isColumn);

  for (const card of cards) {
    card.style.flexGrow = get("grow");
    card.style.flexShrink = get("shrink");
    card.style.flexBasis = get("basis");
  }

  for (const piece of wordPieces) {
    piece.style.flexGrow = get("grow");
    piece.style.flexShrink = get("shrink");
    piece.style.flexBasis = wordBasis;
  }

  cards[0].style.order = get("order");
  cards[0].style.alignSelf = get("alignSelf");
  wordPieces[0].style.order = get("order");
  wordPieces[0].style.alignSelf = get("alignSelf");

  const changedControl = event?.target?.name ?? "direction";
  wordTip.textContent =
    changedControl === "direction" && get("direction").includes("column")
      ? "Look! The word cards stack up and down. They use a smaller starting size so you can see the whole stack."
      : wordTips[changedControl] ?? wordTips.direction;

  const orderDescription =
    get("order") === "0"
      ? "The first animal and word stay in their usual places."
      : `The first animal and word move to spot ${get("order")}.`;

  behaviorOutput.textContent = expectedBehaviors[changedControl]
    ? expectedBehaviors[changedControl](get)
    : expectedBehaviors.justify(get);

  previewExplanation.textContent = [
    `${displayDescriptions[get("display")]} The items ${get("direction").includes("column") ? "stack up and down" : "line up side by side"}.`,
    `${get("wrap") === "nowrap" ? "Items stay together in one long line" : "Items can hop onto new lines"}; justify-content moves them along the line and align-items lines them up across it.`,
    `The different-height animal pictures help you compare alignment. Rows use align-content: ${get("alignContent")}, and the space between items is ${get("gap")}.`,
    `Animal cards start at ${get("basis")}; word cards start at ${wordBasis}${isColumn ? " to make the word stack easy to see" : ""}. Items can grow or shrink. ${orderDescription} The first item can also line up by itself with align-self: ${get("alignSelf")}.`,
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
    `.word-gallery {`,
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
    `.word-piece {`,
    `  flex: ${get("grow")} ${get("shrink")} ${wordBasis};`,
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
    ``,
    `.word-piece:first-child {`,
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
galleryCount.textContent = `${cards.length} little ${cards.length === 1 ? "wonder" : "wonders"}`;
updatePreview();
