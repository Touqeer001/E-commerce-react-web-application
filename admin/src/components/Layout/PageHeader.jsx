export default function PageHeader({ title, children }) {
  return (
    <div className="pagehead">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
