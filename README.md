# RezTailor — Public Demo

A tool that tailors a resume to a specific job description by editing the real document
in place — not regenerating it from a template.

**This is a limited public demo.** Analyses are capped at 3 per visitor per 24 hours,
and each visitor's uploads are private to their own session. This repository contains
only the frontend — the full backend, prompt design, and document-editing engine remain
in a private repository as part of ongoing development.

Live demo: 
---

## What this does

Applying to a job usually means one of two bad options: hand-editing your resume for
every single application, or running it through a tool that rewrites the whole thing
and hopes for the best — often losing your original formatting, or worse, quietly
inventing experience you don't actually have.

RezTailor does something different. You upload your resume and paste in a job
description. It reads both, gives your resume a match score against that specific job,
and shows you exactly which required and preferred skills from the posting you already
demonstrate, and which ones are missing. Then it suggests a short, specific list of
edits — a reworded summary line, an extra bullet point, an addition to your skills
list — each one grounded in something that's genuinely already true on your resume.
It never invents a job you didn't have or a skill you don't possess.

You review every suggestion, uncheck anything you don't want, tweak the wording if you
like, and click one button. The tool edits your actual resume document — the real
formatting, fonts, and layout stay exactly as they were — and hands you back a new,
tailored `.docx` file, ready to submit.

## How it works (high level)

The backend never regenerates your resume from scratch. It unzips the `.docx`, locates
the exact paragraph an AI-suggested edit refers to, and replaces only that paragraph's
text while cloning its original formatting — everything else in the document passes
through untouched. Every suggested edit is verified against the source resume before
it's ever shown to you; anything that can't be located in your actual document is
dropped rather than risked.

## Tech stack

React 18 + Vite 5 + Tailwind CSS (this repo). Backend: Express 5, OpenAI's structured
output API, and direct OOXML manipulation via `jszip` + `xmldom` (private repo).

---

*Built as a personal project during a job search to explore document-level AI editing
without sacrificing formatting integrity or inventing content.*