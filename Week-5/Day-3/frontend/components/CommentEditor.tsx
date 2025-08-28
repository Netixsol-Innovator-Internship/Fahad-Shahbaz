"use client";

import React from "react";

export default function CommentEditor({
  value = "",
  onChange,
  placeholder,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="border rounded p-2 w-full min-h-[80px]"
    />
  );
}
