"use client";

import { useState } from "react";

/**
 * لوگو/آواتار رو نشون می‌ده؛ اگه src نداشته باشیم یا لود عکس با خطا مواجه بشه
 * (لینک شکسته)، به‌جاش fallback (معمولاً حرف اول اسم) رو نشون می‌ده.
 * چون Server Component ها نمی‌تونن onError بگیرن، این یه Client Component کوچیکه
 * که همه‌جای پروژه برای لوگوی شرکت/آواتار کارفرما استفاده می‌شه.
 */
export default function AvatarImage({
  src,
  alt = "",
  fallback,
  imageClassName = "",
}: {
  src?: string | null;
  alt?: string;
  fallback: React.ReactNode;
  imageClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={imageClassName}
      onError={() => setFailed(true)}
    />
  );
}