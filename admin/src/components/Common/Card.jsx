export default function Card({ title, className = "panel", children }) {
  return (
    <article className={className}>
      {title && <h2>{title}</h2>}
      {children}
    </article>
  );
}
