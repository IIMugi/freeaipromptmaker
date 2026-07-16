const steps = [
  {
    title: 'Describe the intended image',
    text: 'Start with the subject, action, setting, and visual goal. The formatter does not invent an image result.',
  },
  {
    title: 'Add only useful constraints',
    text: 'Style, lighting, camera, and supported model parameters are optional. Keep what helps your destination tool.',
  },
  {
    title: 'Copy and test in the model',
    text: 'Generation happens in the destination product. Return here to make small, controlled prompt changes.',
  },
];

export function HowPromptFormattingWorks() {
  return (
    <section id="how-formatting-works" className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6 sm:p-8">
      <p className="text-sm font-medium text-[var(--accent-primary)]">How it works</p>
      <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
        Formatting, not image generation
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        The core generator is deterministic browser-side formatting. It does not call a model, score
        likely output quality, or guarantee what another product will generate.
      </p>
      <ol className="mt-7 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-5">
            <span className="text-sm font-semibold text-[var(--accent-primary)]">0{index + 1}</span>
            <h3 className="mt-3 font-semibold text-[var(--text-primary)]">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
