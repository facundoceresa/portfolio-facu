import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { ContentBlock } from "@/features/content/schemas";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="grid gap-7">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = `h${block.level}` as "h2" | "h3" | "h4";
          return <Tag key={index} className="mt-6 font-display text-3xl font-bold uppercase text-mint">{block.text}</Tag>;
        }
        if (block.type === "paragraph") {
          return <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={{ p: "p", a: SafeLink }}>{block.markdown}</ReactMarkdown>;
        }
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return <List key={index} className="ml-5 list-disc space-y-2 text-[color:var(--muted)]">{block.items.map((item) => <li key={item}>{item}</li>)}</List>;
        }
        if (block.type === "image") {
          const aspectRatio = block.height / block.width;
          const imageClassName = [
            "case-image",
            block.height <= block.width ? "case-image-landscape" : "",
            block.height > block.width && aspectRatio < 2.4 ? "case-image-portrait" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <figure key={index} className="case-image-frame">
              <Image src={block.src} alt={block.alt} width={block.width} height={block.height} className={imageClassName} sizes="(min-width: 1024px) 960px, calc(100vw - 40px)" />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "quote") {
          return <blockquote key={index} className="border-l-2 border-mint pl-5 text-xl text-[color:var(--fog)]">{block.text}</blockquote>;
        }
        if (block.type === "code") {
          return <pre key={index} className="overflow-x-auto border border-[color:var(--line)] bg-[rgba(0,0,0,0.24)] p-4 font-mono text-sm text-[color:var(--glow)]"><code>{block.code}</code></pre>;
        }
        if (block.type === "metric") {
          return <div key={index} className="technical-card p-5"><strong className="font-display text-4xl text-mint">{block.value}</strong><p className="mt-2 text-[color:var(--muted)]">{block.label}</p></div>;
        }
        if (block.type === "callout") {
          return <aside key={index} className="border border-[color:var(--line-strong)] bg-[rgba(45,212,168,0.08)] p-5 text-[color:var(--fog)]">{block.text}</aside>;
        }
        return null;
      })}
    </div>
  );
}

function SafeLink({ node, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) {
  void node;
  const href = props.href ?? "";
  const external = href.startsWith("https://");
  const className = ["content-link", props.className].filter(Boolean).join(" ");
  return <a {...props} className={className} rel={external ? "noopener noreferrer" : undefined} target={external ? "_blank" : undefined} />;
}
