const groups = [
  {
    title: 'Midjourney',
    text: 'Adds parameters such as --ar, --stylize, --chaos and --no at the end of the prompt, where Midjourney expects them.',
  },
  {
    title: 'Flux',
    text: 'Writes a plain descriptive prompt. Flux has no parameter flags in the prompt, so size and other settings stay in your tool.',
  },
  {
    title: 'Stable Diffusion, Leonardo and others',
    text: 'Builds a clear descriptive prompt you can paste anywhere. Negative prompt support differs by tool and model.',
  },
];

export function SupportedModels() {
  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Prompts formatted for each tool</h2>
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
