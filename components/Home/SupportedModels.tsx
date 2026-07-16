const groups = [
  {
    title: 'Midjourney',
    text: 'Formats supported text parameters such as aspect ratio, stylize, chaos, and --no. Confirm current parameters in Midjourney before use.',
  },
  {
    title: 'Flux',
    text: 'Produces a descriptive natural-language prompt. Dimensions and other API or interface settings are not inserted as fake text flags.',
  },
  {
    title: 'Other interfaces',
    text: 'Creates a structured descriptive draft. Model versions, safety behavior, settings, and negative-prompt support vary by provider.',
  },
];

export function SupportedModels() {
  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">What model support means here</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <article key={group.title} className="rounded-2xl border border-[var(--border-default)] p-5">
            <h3 className="font-semibold text-[var(--text-primary)]">{group.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{group.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
