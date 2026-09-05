# Murmurwell

Say it rough. Send it clear.

Murmurwell is a privacy-conscious dictation and transcript-cleanup workspace. The first MVP captures speech where the browser supports it, always supports typed/pasted drafts, applies deterministic cleanup, honors protected terminology, and explains every transformation.

## What works

- Live microphone dictation through the browser Speech Recognition API when available
- Typed and pasted transcript capture everywhere
- Deterministic filler-word removal, casing, and punctuation
- User-controlled spoken-to-written protected-term mappings
- An audit reason for every cleanup step
- Browser-local draft and terminology persistence
- One-click clipboard copy
- Responsive desktop-style interface
- Unit-tested transcript transformation logic

## Important privacy boundary

Murmurwell itself does not store audio. Browser-provided speech recognition may send audio to a browser or operating-system service and must not be described as offline. The deterministic cleanup path runs locally. A future native milestone will bundle an on-device transcription engine such as whisper.cpp; it is intentionally not claimed in this repository today.

## Develop

```bash
npm install
npm run dev
```

Run the quality gate with `npm run check` and `npm audit`.

## Architecture

- React 19, TypeScript, and Vite
- Browser Speech Recognition adapter with a typed-input fallback
- Pure deterministic transformations in `src/domain.ts`
- Vitest coverage for protected terms and cleanup behavior
- Browser local storage for text preferences only

The planned native shell is Tauri 2, but the current development environment does not include Rust, so this first repository is a portable web foundation rather than a non-buildable native scaffold.

Murmurwell is an independent project and is not affiliated with Wispr Flow or any speech-recognition provider.

## License

MIT
