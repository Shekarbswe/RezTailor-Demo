import Card from "./ui/Card.jsx";
import { useAutoResizeTextarea } from "../lib/useAutoResizeTextarea.js";

const STATIC_TYPE_LABELS = {
  summary_replace: "Update summary",
  bullet_replace: "Replace bullet point",
  bullet_insert_after: "Insert new bullet",
};

function isAddType(suggestion) {
  return suggestion.type === "skill_add" || suggestion.type === "environment_add";
}

function typeLabel(suggestion) {
  if (isAddType(suggestion)) {
    return `Add to ${suggestion.location_label}`;
  }
  return STATIC_TYPE_LABELS[suggestion.type] || suggestion.type;
}

function SuggestionItem({ suggestion: s, checked, editValue, onToggle, onEdit, disabled }) {
  const textareaRef = useAutoResizeTextarea(editValue);

  return (
    <li className="flex gap-3" data-testid={`suggestion-${s.suggestion_id}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(s.suggestion_id)}
        disabled={disabled}
        className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
        data-testid={`checkbox-suggestion-${s.suggestion_id}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            title={typeLabel(s)}
            className="max-w-full truncate rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {typeLabel(s)}
          </span>
          {!isAddType(s) && <span className="text-xs text-muted-foreground">{s.location_label}</span>}
        </div>

        {s.before && (
          <p className="mt-2 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive line-through">
            {s.before}
          </p>
        )}

        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => onEdit(s.suggestion_id, e.target.value)}
          disabled={disabled}
          rows={2}
          className="mt-2 w-full resize-none overflow-hidden rounded-md border border-input bg-success/15 p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
        />

        <p className="mt-1.5 text-xs text-muted-foreground">{s.reason}</p>
      </div>
    </li>
  );
}

export default function SuggestionsCard({ suggestions, accepted, edits, onToggle, onEdit, disabled }) {
  return (
    <Card className="p-6" data-testid="card-suggestions">
      <h2 className="text-base font-semibold">Suggested resume edits</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Uncheck anything you don&apos;t want applied, then update the resume.
      </p>

      <ul className="mt-4 space-y-5">
        {suggestions.map((s) => (
          <SuggestionItem
            key={s.suggestion_id}
            suggestion={s}
            checked={accepted.has(s.suggestion_id)}
            editValue={edits[s.suggestion_id] ?? s.after}
            onToggle={onToggle}
            onEdit={onEdit}
            disabled={disabled}
          />
        ))}
      </ul>
    </Card>
  );
}
