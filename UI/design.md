# Design System Document: The Neo-Retro Tactician

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Trickster"
This design system rejects the "flat and friendly" aesthetic of modern web gaming. Instead, it embraces the **Digital Trickster**—a persona that is vibrantly retro, intentionally mischievous, and meticulously crafted. We are moving beyond a "generic 8-bit" look to create a high-end editorial experience that feels like a rare, premium Japanese import game from the 90s, updated for high-resolution PC browsers.

The design breaks the standard template through **intentional asymmetry** and **tonal depth**. We are not just making a game; we are building an environment that feels like it’s playing *with* the user. Expect overlapping elements, "dithered" depth, and a typography scale that balances chaotic retro energy with sophisticated readability.

---

## 2. Colors

The palette is a high-contrast battle between "Energy Yellows" and "Electric Purples," anchored by deep, ink-like surfaces.

### The "No-Line" Rule (Sectioning)
Designers are prohibited from using 1px solid lines for layout sectioning. In this design system, boundaries are defined strictly through background shifts. For instance, a `surface-container-low` activity feed sits directly on a `background` page without a stroke. This forces the layout to feel like a cohesive digital architecture rather than a series of disconnected boxes.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Use the `surface-container` tiers to create a nested sense of importance:
- **Base Level:** `surface` (#fff3fd) for the main canvas.
- **Secondary Level:** `surface-container-low` (#feebff) for sidebars or background groups.
- **Interaction Level:** `surface-container-highest` (#f5d1fd) for active cards or speech bubbles.
By nesting a `lowest` card on a `low` background, we create "soft" depth that feels sophisticated and easy on the eyes.

### The "Dithered Gradient" Rule
Flat colors can feel sterile. To achieve a high-end feel, use gradients transitioning from `primary` (#6c5a00) to `primary_container` (#ffd709) for main CTAs. To stay true to the pixel-art aesthetic, these gradients should be interpreted as "dithered" patterns (checkerboard pixel transitions) to provide visual "soul" and professional polish.

---

## 3. Typography

The typography scale is a dialogue between two worlds: the **Digital Archetype** (retro) and the **Editorial Standard** (modern).

- **Display & Headlines (`spaceGrotesk`):** These represent the "Game Master." Use these for big "Image Guessed!" moments and large headers. Though the system uses `spaceGrotesk` in the code, treat these with high-contrast sizing and tight letter-spacing to mimic the punchy impact of classic pixel-art titles.
- **Body & Titles (`plusJakartaSans`):** The "Narrator." This rounded sans-serif provides the necessary readability for the "cheeky" commentary and instructions. It creates a high-end contrast against the pixelated components, signaling that this is a modern tool wrapped in a retro skin.
- **Hierarchy:** Use `display-lg` (3.5rem) sparingly for "mind-bending" reveals. For standard game feedback, lean into `headline-md` (1.75rem).

---

## 4. Elevation & Depth

We eschew traditional "material" shadows in favor of **Tonal Layering** and **Pixel Offsets**.

- **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural lift without the need for visual clutter.
- **Ambient Shadows:** When a floating effect is required (like a "Guess" modal), use an "8-bit Shadow." This is not a soft blur, but a sharp, offset block using `on_surface` (#3b2841) at a 4-8% opacity, shifted 4px or 8px down and right.
- **The "Ghost Border" Fallback:** If a component requires a border for accessibility, use the `outline_variant` (#bfa5c4) at 20% opacity. Never use a 100% opaque border for containment; it breaks the "trickster" fluidity of the layout.
- **Glassmorphism (Frosted Pixels):** For floating overlays, use `surface_container_highest` with a backdrop-blur. This "frosted glass" effect allows the vibrant background cyans and purples to bleed through, making the game world feel immersive.

---

## 5. Components

### Buttons (The Chunky Tactile)
- **Primary:** `primary_container` (#ffd709) background with a thick 4px bottom border of `primary` (#6c5a00). 
- **States:** On hover, the button should shift down by 2px (reducing the border thickness) to feel "pressed."
- **Shape:** Rigid 0px corners. Roundness is forbidden.

### Comic Speech Bubbles
- **Styling:** Use `surface_container_highest` (#f5d1fd) for the bubble body. 
- **The Tail:** A pixel-stepped triangle pointing to the speaker.
- **Content:** Use `body-md` for the "cheeky" provocation text. This is where the "mischievously cute" vibe lives.

### Chips & Tags
- **Filter Chips:** Use `secondary_container` (#e7c5ff). 
- **Visuals:** No borders. Use `on_secondary_container` (#6b0dab) for the text to maintain high legibility and "pop."

### Input Fields
- **Background:** `surface_container_lowest` (#ffffff).
- **Focus State:** Instead of a blue glow, use a 4px "pixel-frame" using `tertiary` (#006571).
- **Validation:** Error states use `error_container` (#f95630) as a background highlight, never just red text.

---

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Let elements overlap slightly. A character icon can "break" the container of a speech bubble.
- **Leverage High Contrast:** Pair `primary_fixed` (Yellow) against `inverse_surface` (Dark Purple) for "mind-bending" game moments.
- **Embrace White Space:** Use the `surface` colors to create breathing room between high-intensity pixel components.

### Don't:
- **Don't use 1px Borders:** This is the most common mistake. Use background shifts or the Ghost Border (20% opacity) instead.
- **Don't use Standard Curves:** The `roundedness` scale is strictly `0px`. If an element is round, it must be "pixel-round" (made of square blocks).
- **Don't be "Safe":** The vibe is provocative. If a layout feels too orderly or "corporate," add a tilted element or a dithered gradient to break the tension.