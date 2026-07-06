"use client";

export default function PageHeader({ title, description, actions, breadcrumb }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumb}
        <h1 className="text-2xl font-bold font-display tracking-tight text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
