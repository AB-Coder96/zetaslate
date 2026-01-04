import React from "react";

/**
 * Minimal markdown renderer:
 * - headings (#, ##, ###)
 * - bullet lists (-, *)
 * - paragraphs
 * - fenced code blocks ```
 * - inline code `code`
 */
export default function Markdown({ text = "" }) {
  const lines = (text || "").replace(/\r\n/g, "\n").split("\n");

  const out = [];
  let i = 0;

  const renderInline = (s) => {
    // inline code
    const parts = s.split(/(`[^`]+`)/g);
    return parts.map((p, idx) => {
      if (p.startsWith("`") && p.endsWith("`")) {
        return (
          <code key={idx} className="mdInlineCode">
            {p.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={idx}>{p}</React.Fragment>;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    // code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
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
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("```") && !/^(#{1,3})\s+/.test(lines[i]) && !/^(\-|\*)\s+/.test(lines[i])) {
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
