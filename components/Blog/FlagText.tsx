import { Fragment } from 'react';

/** Keeps command-line flags such as "--style raw" from breaking after their dashes. */
export function FlagText({ text }: { text: string }) {
  const parts = text.split(/(--[\w.]+)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('--') ? (
          <span key={index} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
