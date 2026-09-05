import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Clipboard, History, Keyboard, Mic, MicOff, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles, Square, Star, Volume2 } from 'lucide-react';
import { parseProtectedTerms, polishTranscript, type Change } from './domain';
import './App.css';

type SpeechRecognitionLike = {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null; onerror: (() => void) | null;
  start(): void; stop(): void;
};

declare global {
  interface Window { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike; }
}

const SAMPLE = 'um send the product notes from murmur well to open ai you know before lunch';
const DEFAULT_TERMS = 'murmur well => Murmurwell\nopen ai => OpenAI';

function App() {
  const [raw, setRaw] = useState(() => localStorage.getItem('murmurwell-raw') ?? SAMPLE);
  const [termsText, setTermsText] = useState(() => localStorage.getItem('murmurwell-terms') ?? DEFAULT_TERMS);
  const [polished, setPolished] = useState(''); const [changes, setChanges] = useState<Change[]>([]);
  const [listening, setListening] = useState(false); const [notice, setNotice] = useState('Ready. Your draft stays in this browser.');
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const protectedTerms = useMemo(() => parseProtectedTerms(termsText), [termsText]);
  const supported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => { localStorage.setItem('murmurwell-raw', raw); localStorage.setItem('murmurwell-terms', termsText); }, [raw, termsText]);

  function polish() {
    const result = polishTranscript(raw, protectedTerms); setPolished(result.transcript); setChanges(result.changes);
    setNotice(result.transcript ? `${result.changes.length} transparent edits ready.` : 'Add or dictate a draft first.');
  }
  function startListening() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) { setNotice('Live dictation is unavailable here. Type or paste into the capture box.'); return; }
    const instance = new Recognition(); instance.continuous = true; instance.interimResults = true; instance.lang = 'en-US';
    instance.onresult = (event) => { let next = ''; for (let i = 0; i < event.results.length; i++) next += event.results[i][0].transcript; setRaw(next.trim()); };
    instance.onend = () => setListening(false); instance.onerror = () => { setListening(false); setNotice('Microphone capture stopped. Your existing draft is safe.'); };
    recognition.current = instance; instance.start(); setListening(true); setNotice('Listening… browser speech services may process audio outside this app.');
  }
  function stopListening() { recognition.current?.stop(); setListening(false); setNotice('Capture stopped. Review the raw words before polishing.'); }
  async function copyResult() { await navigator.clipboard.writeText(polished || raw); setNotice('Copied to clipboard.'); }
  function reset() { setRaw(SAMPLE); setTermsText(DEFAULT_TERMS); setPolished(''); setChanges([]); setNotice('Sample restored.'); }

  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand-mark"><Volume2 size={20} /></div>
        <nav aria-label="Workspace"><button className="nav-button active" aria-label="Capture"><Mic size={19} /></button><button className="nav-button" aria-label="History"><History size={19} /></button><button className="nav-button" aria-label="Settings"><SlidersHorizontal size={19} /></button></nav>
        <span className="privacy-dot" title="Local workspace"><ShieldCheck size={18} /></span>
      </aside>

      <section className="workspace">
        <header className="topbar"><div><p className="eyebrow">Murmurwell</p><h1>Say it rough. Send it clear.</h1></div><div className="top-actions"><span className="local-pill"><span /> Browser-local draft</span><a className="quiet-button" href="https://github.com/Satwik-P28/murmurwell" target="_blank" rel="noreferrer"><Star size={15} /> Star</a><button className="quiet-button" onClick={reset}><RotateCcw size={15} /> Reset</button></div></header>

        <div className="workspace-grid">
          <section className="editor-card">
            <div className="card-heading"><div><p className="step">01 · Capture</p><h2>Your unfiltered words</h2></div><div className={`level ${listening ? 'live' : ''}`} aria-hidden="true">{[1,2,3,4,5].map((bar) => <i key={bar} />)}</div></div>
            <textarea value={raw} onChange={(event) => setRaw(event.target.value)} aria-label="Raw transcript" placeholder="Speak, type, or paste a rough thought…" />
            <div className="capture-bar"><button className={`record-button ${listening ? 'recording' : ''}`} onClick={listening ? stopListening : startListening}>{listening ? <Square size={17} fill="currentColor" /> : <Mic size={19} />} {listening ? 'Stop capture' : 'Start dictation'}</button><span>{supported ? 'Browser dictation available' : 'Typing mode · dictation unavailable'}</span><button className="polish-button" onClick={polish}><Sparkles size={17} /> Polish draft</button></div>
          </section>

          <aside className="terms-card"><div className="card-heading"><div><p className="step">Guardrail</p><h2>Protected terms</h2></div><ShieldCheck size={20} /></div><p className="help">One mapping per line. These replacements run before any cleanup.</p><textarea value={termsText} onChange={(event) => setTermsText(event.target.value)} aria-label="Protected term mappings" spellCheck={false} /><div className="term-count"><Check size={14} /> {protectedTerms.length} mappings active</div></aside>

          <section className="result-card">
            <div className="card-heading"><div><p className="step">02 · Review</p><h2>Clean transcript</h2></div><button className="quiet-button" onClick={() => void copyResult()}><Clipboard size={15} /> Copy</button></div>
            <div className={`result ${polished ? '' : 'empty'}`}>{polished || 'Your polished transcript will appear here. Nothing changes until you press Polish draft.'}</div>
            <p className="notice" aria-live="polite">{notice}</p>
          </section>

          <aside className="audit-card"><div className="card-heading"><div><p className="step">Audit trail</p><h2>What changed</h2></div><History size={20} /></div>{changes.length ? <ol>{changes.map((change, index) => <li key={`${change.reason}-${index}`}><span>{index + 1}</span><div><strong>{change.reason}</strong><p>{change.after}</p></div></li>)}</ol> : <div className="audit-empty"><Keyboard size={22} /><p>Polish a draft to see every edit and its reason.</p></div>}</aside>
        </div>
        <footer><MicOff size={14} /> Murmurwell does not record or store audio. Live dictation, when available, is supplied by your browser and may not be offline. <a href="https://github.com/Satwik-P28/murmurwell" target="_blank" rel="noreferrer">Star on GitHub</a></footer>
      </section>
    </main>
  );
}

export default App;
