# Murmurwell

[![Live demo](https://img.shields.io/badge/live%20demo-try%20now-2ea44f?style=for-the-badge)](https://satwik-p28.github.io/murmurwell/)
[![GitHub stars](https://img.shields.io/github/stars/Satwik-P28/murmurwell?style=for-the-badge&logo=github)](https://github.com/Satwik-P28/murmurwell/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/Satwik-P28/murmurwell/ci.yml?branch=main&style=for-the-badge)](https://github.com/Satwik-P28/murmurwell/actions)

**Say it rough. Send it clear.**

Murmurwell is a **free, privacy-conscious, open-source dictation and transcript-cleanup workspace** — a transparent alternative to paid voice tools such as Wispr Flow. Capture speech where the browser supports it, always type or paste a draft, apply deterministic cleanup, honor protected terminology, and **see a reason for every change**.

[**Try the public demo**](https://satwik-p28.github.io/murmurwell/) · [**Star this repo**](https://github.com/Satwik-P28/murmurwell) · [**Run with Docker**](#docker)

No account. Murmurwell itself does not store audio.

## Why this exists

Paid dictation apps are fast — and opaque. They silently fix names, drop fillers, and send audio to a vendor you cannot inspect. Murmurwell splits the job in two:

1. **Capture** — browser speech recognition when available, or typed/pasted text everywhere.
2. **Polish** — deterministic, auditable cleanup that you control, including protected-term maps such as `open ai => OpenAI`.

| | Paid dictation apps | **Murmurwell** |
| --- | --- | --- |
| Price | Subscription | Free, MIT, self-host |
| Cleanup | Black-box rewrite | Every step has a reason |
| Names & brands | Easy to mangle | Protected-term mappings |
| Audio storage | Vendor cloud | This app never stores audio |
| Offline cleanup | Rare | Deterministic polish is local |

## What works

- Live microphone dictation through the browser Speech Recognition API when available
- Typed and pasted transcript capture everywhere
- Deterministic filler-word removal, casing, and punctuation
- User-controlled spoken-to-written **protected-term** mappings
- An audit reason for every cleanup step
- Browser-local draft and terminology persistence
- One-click clipboard copy
- Responsive desktop-style interface
- Unit-tested transcript transformation logic

## Important privacy boundary

Murmurwell itself does not store audio. Browser-provided speech recognition **may send audio to a browser or operating-system service** and must not be described as offline. The deterministic cleanup path runs locally. A future native milestone will bundle an on-device transcription engine such as whisper.cpp; it is intentionally not claimed in this repository today.

## Quick start

Requires [Node.js](https://nodejs.org/) 22 or later.

```bash
git clone https://github.com/Satwik-P28/murmurwell.git
cd murmurwell
npm ci
npm run dev
```

Open the printed local URL. Type a rough draft and press **Polish draft** — no microphone required.

## Docker

```bash
docker pull ghcr.io/satwik-p28/murmurwell:latest
docker run --rm -p 3000:3000 ghcr.io/satwik-p28/murmurwell:latest
```

Or build locally:

```bash
docker compose up --build
```

## Architecture

- React 19, TypeScript, and Vite
- Browser Speech Recognition adapter with a typed-input fallback
- Pure deterministic transformations in `src/domain.ts`
- Vitest coverage for protected terms and cleanup behavior
- Browser local storage for text preferences only

The planned native shell is Tauri 2, but the current development environment does not include Rust, so this first repository is a portable web foundation rather than a non-buildable native scaffold.

## Quality checks

```bash
npm run check
npm audit
```

## Contributing

If Murmurwell made a messy voice note sendable — **[star the repo](https://github.com/Satwik-P28/murmurwell)** so other people can find transparent dictation.

See [CONTRIBUTING.md](CONTRIBUTING.md). Domain changes to cleanup rules need tests.

### Blurb for awesome-lists

> **[Murmurwell](https://github.com/Satwik-P28/murmurwell)** — Privacy-conscious open-source dictation with auditable transcript cleanup and protected terms. `MIT` `Docker` `Nodejs` `Privacy`

Murmurwell is an independent project and is not affiliated with Wispr Flow or any speech-recognition provider.

## License

[MIT](LICENSE)
