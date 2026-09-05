'use client';

import React from 'react';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

export function FormattedMessage({ content, isUser = false }: FormattedMessageProps) {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // Split message by lines
  const lines = content.split('\n');

  const renderFormattedText = (text: string) => {
    // Replace **bold** with <strong> and *italic* with <em>
    const parts = [];
    // Regex matching **bold** or *italic*
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Push text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith('*') && raw.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-indigo-900 font-medium">
            {raw.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Check for bullet list: • or - or *
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-indigo-600 font-bold leading-none mt-1">•</span>
              <div className="flex-1">{renderFormattedText(bulletText)}</div>
            </div>
          );
        }

        // Check for numbered list: 1. 2. etc.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const itemText = numMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold flex-shrink-0 mt-0.5 border border-indigo-100">
                {num}
              </span>
              <div className="flex-1">{renderFormattedText(itemText)}</div>
            </div>
          );
        }

        return (
          <div key={idx} className="my-0.5">
            {renderFormattedText(line)}
          </div>
        );
      })}
    </div>
  );
}
