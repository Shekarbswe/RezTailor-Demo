import { useEffect, useRef, useState } from "react";

function RezTailorLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 text-primary" fill="none" aria-label="RezTailor logo">
      <rect x="4" y="4" width="32" height="32" rx="7" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M14 13h12M14 20h12M14 27h7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 6.5 8 10l4-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 2.5h5l2.5 2.5v8A1.5 1.5 0 0 1 11 14.5H5A1.5 1.5 0 0 1 3.5 13V4A1.5 1.5 0 0 1 5 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2.5V6h2.5M5.5 8.5h5M5.5 10.5h5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M3.5 12.5c1.1-1.8 2.9-2.7 4.5-2.7s3.4.9 4.5 2.7" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 2.5v1.2M8 12.3v1.2M12.3 8h-1.2M5 8H3.8M10.7 5.3l-.8.8M6.1 10l-.8.8M10.7 10.7l-.8-.8M6.1 6l-.8-.8" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export default function Header({ candidateName }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const candidateInitial = candidateName?.trim()?.charAt(0)?.toUpperCase() ?? "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen((current) => !current);
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4" data-testid="app-header">
      <div className="flex items-center gap-3">
        <RezTailorLogo />
        <div>
          <h1 className="text-base font-semibold leading-tight">RezTailor</h1>
          <p className="text-xs text-muted-foreground">Match &amp; tailor without rewriting</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {candidateName && (
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={toggleProfileMenu}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              data-testid="base-resume-badge"
              className="flex items-center gap-2 rounded-full border border-border bg-secondary px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {candidateInitial}
              </span>
              <span className="font-medium text-foreground">{candidateName}</span>
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isProfileMenuOpen && (
              <div
                role="menu"
                aria-label="Candidate profile menu"
                className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-md border border-border bg-background shadow-lg shadow-black/10"
              >
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent focus:outline-none focus:bg-accent"
                >
                  <FileTextIcon />
                  <span>Manage Resumes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent focus:outline-none focus:bg-accent"
                >
                  <UserIcon />
                  <span>Candidate Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent focus:outline-none focus:bg-accent"
                >
                  <SettingsIcon />
                  <span>Settings</span>
                </button>
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          data-testid="button-theme-toggle"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-accent"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
