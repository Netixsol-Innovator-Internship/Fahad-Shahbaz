// "use client";

// import React, { useEffect, useRef, useCallback } from "react";

// export default function CommentEditor({
//   value = "",
//   onChange,
//   placeholder,
// }: {
//   value?: string;
//   onChange?: (v: string) => void;
//   placeholder?: string;
// }) {
//   const ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (ref.current && value !== ref.current.innerHTML) {
//       ref.current.innerHTML = value;
//     }
//   }, [value]);

//   const notifyChange = useCallback(() => {
//     if (!ref.current) return;
//     onChange?.(ref.current.innerHTML);
//   }, [onChange]);

//   function exec(cmd: string, arg?: string) {
//     document.execCommand(cmd, false, arg);
//     notifyChange();
//   }

//   return (
//     <div className="w-full">
//       <div className="flex gap-2 mb-2">
//         <button
//           type="button"
//           onClick={() => exec("bold")}
//           className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
//           aria-label="Bold"
//         >
//           <strong>B</strong>
//         </button>
//         <button
//           type="button"
//           onClick={() => exec("italic")}
//           className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
//           aria-label="Italic"
//         >
//           <em>I</em>
//         </button>
//         <button
//           type="button"
//           onClick={() => exec("underline")}
//           className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
//           aria-label="Underline"
//         >
//           <u>U</u>
//         </button>
//       </div>

//       <div
//         ref={ref}
//         contentEditable
//         suppressContentEditableWarning
//         onInput={notifyChange}
//         className="min-h-[80px] p-3 border rounded prose max-w-none focus:outline-none focus:ring-2 focus:ring-blue-300"
//         data-placeholder={placeholder || "Write a comment..."}
//         style={{ whiteSpace: "pre-wrap" }}
//       />
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef, useCallback } from "react";

export default function CommentEditor({
  value = "",
  onChange,
  placeholder,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Keep external value in sync
  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const notifyChange = useCallback(() => {
    if (!ref.current) return;
    onChange?.(ref.current.innerHTML); // send HTML, not plain text
  }, [onChange]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    notifyChange();
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          • List
        </button>
      </div>

      {/* Editable box */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={notifyChange}
        className="min-h-[100px] p-3 border rounded prose max-w-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        data-placeholder={placeholder || "Write a comment..."}
        style={{
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
}
