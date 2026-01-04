import React from "react";

/**
 * Minimal markdown renderer:
 * - headings (#, ##, ###)
 * - bullet lists (-, *)
 * - paragraphs
 * - fenced code blocks ```
 * - inline code `code`
 * - images ![alt](url)
 *
 * Multiple images side-by-side:
 *   Put multiple image syntaxes on the SAME line, e.g.
 *   ![a](url1) ![b](url2) ![c](url3)
 */
export default function Markdown({ text = "", baseUrl = "" }) {
  const lines = (text || "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  function joinUrl(base, path) {
    const b = (base || "").replace(/\/$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${b}${p}`;
  }

  function resolveImgSrc(src) {
    if (!src) return src;
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) return src;
    // relative or absolute path -> attach to baseUrl if provided
    return baseUrl ? joinUrl(baseUrl, src) : src;
  }

  const renderInline = (s) => {
  // 1) Split out inline code first so we don't parse markdown inside `code`
  const parts = s.split(/(`[^`]+`)/g);

  const parseMarks = (text, keyPrefix = "") => {
    // Supports: **bold**, *italic*, __bold__, _italic_, ~~strike~~, [text](url)
    const tokenRe =
      /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|~~[^~]+~~)/g;

    const out = [];
    let last = 0;
    let m;

    while ((m = tokenRe.exec(text))) {
      const start = m.index;
      const token = m[0];

      if (start > last) out.push(text.slice(last, start));

      // Link: [text](url)
      if (token.startsWith("[") && token.includes("](")) {
        const mm = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (mm) {
          out.push(
            <a key={`${keyPrefix}a${start}`} href={mm[2]} target="_blank" rel="noreferrer">
              {mm[1]}
            </a>
          );
        } else {
          out.push(token);
        }
      }
      // Image inline: ![alt](src)  (keeps it simple; your gallery logic still works too)
      else if (token.startsWith("![") && token.includes("](")) {
        const mm = token.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
        if (mm) {
          out.push(
            <img
              key={`${keyPrefix}img${start}`}
              className="mdImg"
              src={mm[2]}
              alt={mm[1] || ""}
              title={mm[3] || mm[1] || ""}
              loading="lazy"
            />
          );
        } else {
          out.push(token);
        }
      }
      // Bold: **text** or __text__
      else if (
        (token.startsWith("**") && token.endsWith("**")) ||
        (token.startsWith("__") && token.endsWith("__"))
      ) {
        out.push(
          <strong key={`${keyPrefix}s${start}`}>
            {token.slice(2, -2)}
          </strong>
        );
      }
      // Italic: *text* or _text_
      else if (
        (token.startsWith("*") && token.endsWith("*")) ||
        (token.startsWith("_") && token.endsWith("_"))
      ) {
        out.push(
          <em key={`${keyPrefix}e${start}`}>
            {token.slice(1, -1)}
          </em>
        );
      }
      // Strike: ~~text~~
      else if (token.startsWith("~~") && token.endsWith("~~")) {
        out.push(
          <del key={`${keyPrefix}d${start}`}>
            {token.slice(2, -2)}
          </del>
        );
      } else {
        out.push(token);
      }

      last = start + token.length;
    }

    if (last < text.length) out.push(text.slice(last));
    return out;
  };

  return parts.flatMap((p, idx) => {
    // Inline code: `code`
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code key={`c${idx}`} className="mdInlineCode">
          {p.slice(1, -1)}
        </code>
      );
    }

    // Everything else: parse bold/italic/links/etc.
    return parseMarks(p, `t${idx}_`);
  });
};

  // If a line contains ONLY markdown images (one or many), render a gallery row
  function parseImageOnlyLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g;
    const imgs = [];
    let m;
    while ((m = re.exec(trimmed))) {
      imgs.push({ alt: m[1] || "", src: m[2], title: m[3] || "" });
    }
    if (!imgs.length) return null;

    const leftover = trimmed.replace(re, "").trim();
    if (leftover !== "") return null; // line had other text too

    return imgs;
  }

  while (i < lines.length) {
    const line = lines[i];

    // image-only line (supports multiple images per line)
    const imgs = parseImageOnlyLine(line);
    if (imgs) {
      out.push(
        <div key={out.length} className="mdGallery">
          {imgs.map((img, idx) => (
            <img
              key={idx}
              className="mdImg"
              src={resolveImgSrc(img.src)}
              alt={img.alt}
              title={img.title || img.alt}
              loading="lazy"
            />
          ))}
        </div>
      );
      i++;
      continue;
    }

    // code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // closing ```
      out.push(
        <pre key={out.length} className="mdCode">
          <div className="mdCodeLang">{lang || "code"}</div>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // headings
    const hMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const content = hMatch[2];
      const Tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      out.push(<Tag key={out.length}>{renderInline(content)}</Tag>);
      i++;
      continue;
    }

    // bullet list
    if (/^(\-|\*)\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^(\-|\*)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\-|\*)\s+/, ""));
        i++;
      }
      out.push(
        <ul key={out.length} className="mdList">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // blank
    if (!line.trim()) {
      i++;
      continue;
    }

    // paragraph
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^(\-|\*)\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }

    out.push(
      <p key={out.length} className="mdP">
        {renderInline(para.join(" "))}
      </p>
    );
  }

  return <div className="md">{out}</div>;
}
