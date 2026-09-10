"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block w-full">
      <input
        type={visible ? "text" : "password"}
        className={`${className} pl-10`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/20"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </span>
  );
}