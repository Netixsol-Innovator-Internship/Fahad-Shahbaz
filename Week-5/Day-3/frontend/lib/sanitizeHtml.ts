// Lightweight client-side sanitizer and decoder.
// Purpose: decode escaped HTML if present, then parse and whitelist tags/attrs.
export default function sanitizeHtml(input: string) {
  if (!input) return "";
  try {
    let src = input;
    // If the string looks escaped, try decoding multiple times until we see markup
    if (typeof document !== "undefined" && !/<[a-z][\s\S]*>/i.test(src)) {
      let last = src;
      for (let i = 0; i < 5; i++) {
        const ta = document.createElement("textarea");
        ta.innerHTML = last;
        const decoded = ta.value;
        if (!decoded || decoded === last) break;
        last = decoded;
        if (/<[a-z][\s\S]*>/i.test(last)) {
          src = last;
          break;
        }
      }
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(src, "text/html");

    const ALLOWED_TAGS = new Set([
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "br",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "span",
    ]);

    const ALLOWED_ATTRS: Record<string, Set<string>> = {
      a: new Set(["href", "target", "rel"]),
      span: new Set(["style"]),
    };

    function clean(node: Node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
          const parent = el.parentNode;
          if (parent) {
            while (el.firstChild) parent.insertBefore(el.firstChild, el);
            parent.removeChild(el);
            return;
          }
        } else {
          const allowed = ALLOWED_ATTRS[tag] || new Set<string>();
          const attrs = Array.from(el.attributes).map((a) => a.name);
          attrs.forEach((name) => {
            if (!allowed.has(name)) el.removeAttribute(name);
            else if (tag === "a" && name === "href") {
              const v = el.getAttribute("href") || "";
              if (!/^https?:\/\//i.test(v) && !/^mailto:/i.test(v)) {
                el.removeAttribute("href");
              }
            }
          });
        }
      }
      let child = node.firstChild;
      while (child) {
        const next = child.nextSibling;
        clean(child);
        child = next;
      }
    }

    clean(doc.body);
    return doc.body.innerHTML;
  } catch {
    return input.replace(/<[^>]*>/g, "");
  }
}
