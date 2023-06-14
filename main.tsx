/** @jsx h */

import blog, { h } from "blog";
import defineConfig from "./uno.config.ts";

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
  section: () => (
    <section
      mt="8"
    >
      <a
        href="https://b.hatena.ne.jp/entry/"
        className="hatena-bookmark-button"
        data-hatena-bookmark-layout="basic-label-counter"
        data-hatena-bookmark-lang="ja"
        title="このエントリーをはてなブックマークに追加"
      >
        <img
          src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
          alt="このエントリーをはてなブックマークに追加"
          width="20"
          height="20"
          style="border: none;"
        />
      </a>
      <script
        type="text/javascript"
        src="https://b.st-hatena.com/js/bookmark_button.js"
        charSet="utf-8"
        async="async"
      >
      </script>
    </section>
  ),
  unocss: defineConfig,
});
