"use client";

export default function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className="text-center mb-8">
      <p className="text-destructive">{error}</p>
    </div>
  );
}
