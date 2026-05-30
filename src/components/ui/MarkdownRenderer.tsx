import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  text: string;
  className?: string;
  paragraphClassName?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  text,
  className,
  paragraphClassName,
}) => {
  if (!text) return null;

  // Split content into blocks (paragraphs, headers, lists) by double line breaks
  const blocks = text.split(/\n\s*\n/);

  const renderInline = (inlineText: string) => {
    // Basic inline parser for **bold**, *italic*, and `code`
    const parts = [];
    let currentIndex = 0;

    // Matches **bold** or *italic* or `code`
    const regex = /(\*\*|__)(.*?)\1|(`)(.*?)\3|(\*)(.*?)\5/g;
    let match;

    while ((match = regex.exec(inlineText)) !== null) {
      const matchIndex = match.index;

      // Push plain text before the match
      if (matchIndex > currentIndex) {
        parts.push(inlineText.substring(currentIndex, matchIndex));
      }

      if (match[2]) {
        // Bold: **text**
        parts.push(
          <strong key={matchIndex} className="font-bold text-text-primary">
            {match[2]}
          </strong>
        );
      } else if (match[4]) {
        // Inline code: `text`
        parts.push(
          <code
            key={matchIndex}
            className="px-1.5 py-0.5 bg-sidebar-bg/60 border border-border text-accent font-mono rounded text-[11px]"
          >
            {match[4]}
          </code>
        );
      } else if (match[6]) {
        // Italic: *text*
        parts.push(
          <em key={matchIndex} className="italic text-text-primary/95">
            {match[6]}
          </em>
        );
      }

      currentIndex = regex.lastIndex;
    }

    if (currentIndex < inlineText.length) {
      parts.push(inlineText.substring(currentIndex));
    }

    return parts.length > 0 ? parts : inlineText;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Headers: ### Heading
        if (trimmed.startsWith("#")) {
          const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
          if (match) {
            const level = match[1].length;
            const content = match[2];
            const sizeClass =
              level === 1
                ? "text-base font-bold"
                : level === 2
                  ? "text-sm font-semibold"
                  : "text-[13px] font-semibold";

            return React.createElement(
              `h${Math.min(level + 1, 6)}`,
              {
                key: blockIdx,
                className: cn("text-text-primary mt-3 mb-1 font-semibold leading-snug", sizeClass),
              },
              renderInline(content)
            );
          }
        }

        // 2. Unordered lists starting at block level
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const items = trimmed.split(/\n(?=[\*\-]\s)/);
          return (
            <ul key={blockIdx} className="list-disc pl-4 space-y-1 my-1">
              {items.map((item, itemIdx) => {
                const itemContent = item.replace(/^[\*\-]\s+/, "");
                return (
                  <li
                    key={itemIdx}
                    className={cn(
                      "text-[13px] leading-relaxed text-text-secondary",
                      paragraphClassName
                    )}
                  >
                    {renderInline(itemContent)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // 3. Ordered lists starting at block level
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\n(?=\d+\.\s)/);
          return (
            <ol key={blockIdx} className="list-decimal pl-4 space-y-1 my-1">
              {items.map((item, itemIdx) => {
                const itemContent = item.replace(/^\d+\.\s+/, "");
                return (
                  <li
                    key={itemIdx}
                    className={cn(
                      "text-[13px] leading-relaxed text-text-secondary",
                      paragraphClassName
                    )}
                  >
                    {renderInline(itemContent)}
                  </li>
                );
              })}
            </ol>
          );
        }

        // 4. Standalone paragraph with internal lists separated by single \n
        if (trimmed.includes("\n* ") || trimmed.includes("\n- ") || trimmed.includes("\n1. ")) {
          const lines = trimmed.split("\n");
          return (
            <div key={blockIdx} className="space-y-1">
              {lines.map((line, lineIdx) => {
                const lineTrimmed = line.trim();
                if (lineTrimmed.startsWith("* ") || lineTrimmed.startsWith("- ")) {
                  return (
                    <div
                      key={lineIdx}
                      className="flex items-start gap-1.5 pl-3 text-[13px] leading-relaxed text-text-secondary"
                    >
                      <span className="text-accent select-none mt-1 shrink-0">•</span>
                      <span className={cn("flex-1", paragraphClassName)}>
                        {renderInline(lineTrimmed.replace(/^[\*\-]\s+/, ""))}
                      </span>
                    </div>
                  );
                }
                if (/^\d+\.\s+/.test(lineTrimmed)) {
                  const match = lineTrimmed.match(/^(\d+)\.\s+(.*)$/);
                  return (
                    <div
                      key={lineIdx}
                      className="flex items-start gap-1.5 pl-3 text-[13px] leading-relaxed text-text-secondary"
                    >
                      <span className="text-accent font-semibold select-none shrink-0">
                        {match ? match[1] : "1"}.
                      </span>
                      <span className={cn("flex-1", paragraphClassName)}>
                        {renderInline(match ? match[2] : lineTrimmed)}
                      </span>
                    </div>
                  );
                }
                return (
                  <p
                    key={lineIdx}
                    className={cn(
                      "text-[13px] leading-relaxed text-text-secondary",
                      paragraphClassName
                    )}
                  >
                    {renderInline(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        // Default: Paragraph
        return (
          <p
            key={blockIdx}
            className={cn("text-[13px] leading-relaxed text-text-secondary", paragraphClassName)}
          >
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
