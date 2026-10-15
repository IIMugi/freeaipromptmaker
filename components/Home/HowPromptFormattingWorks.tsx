const steps = [
  {
    title: 'Describe the image',
    text: 'Start with the subject, what it is doing and where. A short, clear sentence is enough.',
  },
  {
    title: 'Add style, lighting and camera',
    text: 'Pick an art style, light and camera angle, and set parameters such as aspect ratio for tools that use them.',
  },
  {
    title: 'Copy it into your tool',
    text: 'Paste the prompt into Midjourney, Stable Diffusion, Flux or another generator, then come back to tweak one detail at a time.',
  },
];

export function HowPromptFormattingWorks() {
  return (
    <section id="how-formatting-works" className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6 sm:p-8">
      <p className="text-sm font-medium text-[var(--accent-primary)]">How it works</p>
      <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
        Write a better prompt in three steps
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        The generator writes the prompt; you create the image in the tool you already use. Your prompt
        text is never sent to a server.
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
