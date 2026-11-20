// components/chat/chat-markdown.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-2.5 leading-relaxed last:mb-0">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-navy">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-steel-700">{children}</em>
        ),
        h1: ({ children }) => (
          <h3 className="mb-2 mt-3 font-display text-sm font-black uppercase tracking-wider text-navy first:mt-0">
            {children}
          </h3>
        ),
        h2: ({ children }) => (
          <h3 className="mb-1.5 mt-3 font-display text-xs font-black uppercase tracking-wider text-navy first:mt-0">
            {children}
          </h3>
        ),
        h3: ({ children }) => (
          <h4 className="mb-1 mt-2.5 text-xs font-bold uppercase tracking-wider text-navy first:mt-0">
            {children}
          </h4>
        ),
        ul: ({ children }) => (
          <ul className="mb-2.5 list-disc space-y-1 pl-5 marker:text-knicks last:mb-0">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2.5 list-decimal space-y-1 pl-5 marker:font-mono marker:font-bold marker:text-knicks last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-knicks-600 underline underline-offset-2 hover:text-navy"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-3 border-steel-200" />,
        table: ({ children }) => (
          <div className="my-2.5 overflow-x-auto rounded-xs border border-steel-200 bg-white">
            <table className="w-full border-collapse text-left text-xs">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-steel-100 text-[11px] font-bold uppercase tracking-wider text-navy">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="border-b border-steel-200 px-2.5 py-1.5 font-bold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-steel-100 px-2.5 py-1.5 font-mono text-xs text-steel-900">
            {children}
          </td>
        ),
        code: ({ children }) => (
          <code className="rounded-xs bg-steel-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-navy">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}