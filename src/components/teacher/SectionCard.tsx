import { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: React.ReactNode;

  description?: string;
  children: ReactNode;
}

export function SectionCard({ eyebrow, title, description, children }: Props) {
  return (
    <section className="rounded-3xl bg-card/60 border border-border/60 p-6 md:p-8 mb-6 shadow-soft">
      <header className="mb-6">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="font-display text-xl md:text-2xl text-foreground mt-2">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}
