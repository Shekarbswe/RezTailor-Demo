export default function Card({ className = "", ...props }) {
  return <div className={`rounded-lg border card-border bg-card ${className}`} {...props} />;
}
