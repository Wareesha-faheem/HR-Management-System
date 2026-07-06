"use client";

import { initials } from "@/utils/formatters";

export default function Avatar({ firstName = "", lastName = "", color = "#1E5EFF", size = 40, src }) {
  const dim = { width: size, height: size, fontSize: size * 0.38 };

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        style={dim}
        className="rounded-full object-cover border border-[rgb(var(--border-subtle))]"
      />
    );
  }

  return (
    <div
      style={{ ...dim, background: `linear-gradient(135deg, ${color}, #0B2A9C)` }}
      className="flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0"
    >
      {initials(firstName, lastName)}
    </div>
  );
}
