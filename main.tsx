/** @jsx h */

import blog, { h } from "blog";
import defineConfig from "./uno.config.ts";
import { Section } from "./section.tsx";

blog({
  title: "No one knows unknowns",
  avatar: "avatar.png",
  author: "r4wxii",
  links: [
    { title: "Twitter", url: "https://twitter.com/r4wxii" },
    { title: "GitHub", url: "https://github.com/r4wxii" },
    { title: "Email", url: "mailto:contact@r4wxii.com" },
  ],
  lang: "jp",
  favicon: "https://twemoji.maxcdn.com/v/latest/72x72/1f643.png",
  section: Section,
  unocss: defineConfig,
});
