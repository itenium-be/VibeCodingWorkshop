import confetti from 'canvas-confetti';
import { type FormEvent, useEffect, useState } from 'react';
import {
  type Countdown,
  decodeShare,
  encodeShare,
  moons,
  nightsLeft,
  progress,
  sortSoonestFirst,
  THEMES,
  type ThemeId,
  timeLeft,
  toDateString,
} from './countdown';
import { addShared, load, save } from './store';
import { LOOKS, lookOf, Scene } from './themes';

const EMOJIS = ['🦄', '🚀', '🎢', '🐶', '⚽', '🎠', '🦖', '🍦', '✈️', '🎡', '🐴', '🎉'];

const go = (hash: string) => {
  location.hash = hash;
};

const useHash = () => {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const onChange = () => setHash(location.hash);
    addEventListener('hashchange', onChange);
    return () => removeEventListener('hashchange', onChange);
  }, []);
  return hash;
};

const useNow = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const nachtjes = (n: number) => (n === 1 ? 'nachtje' : 'nachtjes');

export const App = () => {
  const hash = useHash();
  const [list, setList] = useState(() => load(localStorage));

  const update = (next: Countdown[]) => {
    setList(next);
    save(localStorage, next);
  };

  useEffect(() => {
    if (!hash.startsWith('#/deel')) return;
    const shared = decodeShare(hash);
    if (!shared) return go('#/');
    const { list: next, id } = addShared(list, shared);
    if (next !== list) update(next);
    location.replace(`#/c/${id}`);
  });

  const id = hash.match(/^#\/c\/(.+)$/)?.[1];
  const current = list.find((c) => c.id === id);

  if (hash === '#/nieuw' || (list.length === 0 && !hash.startsWith('#/deel')))
    return (
      <NewCountdown
        canCancel={list.length > 0}
        onCreate={(c) => {
          update([...list, c]);
          go(`#/c/${c.id}`);
        }}
      />
    );
  if (current)
    return (
      <Detail
        c={current}
        onDelete={() => {
          update(list.filter((c) => c.id !== current.id));
          go('#/');
        }}
      />
    );
  return <Home list={list} />;
};

const Home = ({ list }: { list: Countdown[] }) => {
  const now = useNow();
  return (
    <main className="page">
      <Scene c={{ theme: null, emoji: null }} />
      <h1 className="brand">Nog hoeveel nachtjes?</h1>
      <ul className="cards">
        {sortSoonestFirst(list).map((c) => {
          const look = lookOf(c);
          const n = nightsLeft(c.date, now);
          return (
            <li key={c.id}>
              <a
                className="card"
                href={`#/c/${c.id}`}
                style={{ background: `linear-gradient(135deg, ${look.sky[0]}, ${look.sky[1]})` }}
              >
                <span className="card-emoji">{look.emoji}</span>
                <span className="card-title">{c.title}</span>
                <span className="card-nights">
                  {n === 0 ? (
                    'Het is zover!'
                  ) : (
                    <>
                      <b>{n}</b> {nachtjes(n)}
                    </>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <a className="button big" href="#/nieuw">
        + Nieuw aftellen
      </a>
    </main>
  );
};

const NewCountdown = ({ canCancel, onCreate }: { canCancel: boolean; onCreate: (c: Countdown) => void }) => {
  const today = toDateString(new Date());
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [theme, setTheme] = useState<ThemeId | null>('zee');
  const [emoji, setEmoji] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onCreate({ id: crypto.randomUUID(), title: title.trim(), date, created: today, theme, emoji });
  };

  return (
    <main className="page">
      <Scene c={{ theme, emoji }} />
      {canCancel && (
        <a className="back" href="#/">
          ‹ Alles
        </a>
      )}
      <form className="panel" onSubmit={submit}>
        <h1>Waar tellen we naar af?</h1>
        <label>
          Wat gaat er gebeuren?
          <input
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Vakantie naar Italië"
          />
        </label>
        <label>
          Wanneer?
          <input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <fieldset>
          <legend>Kies een thema…</legend>
          <div className="picker">
            {THEMES.map((t) => (
              <button
                type="button"
                key={t}
                aria-pressed={theme === t}
                onClick={() => {
                  setTheme(t);
                  setEmoji(null);
                }}
              >
                <span>{LOOKS[t].emoji}</span>
                {LOOKS[t].label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>…of een emoji</legend>
          <div className="picker emojis">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                aria-pressed={emoji === e}
                aria-label={e}
                onClick={() => {
                  setEmoji(e);
                  setTheme(null);
                }}
              >
                <span>{e}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <button className="button big" type="submit">
          Start met aftellen
        </button>
      </form>
    </main>
  );
};

const Detail = ({ c, onDelete }: { c: Countdown; onDelete: () => void }) => {
  const now = useNow();
  const [toast, setToast] = useState('');
  const n = nightsLeft(c.date, now);
  const t = timeLeft(c.date, now);
  const m = moons(c, now);
  const look = lookOf(c);

  useEffect(() => {
    if (n !== 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fire = () => confetti({ particleCount: 140, spread: 100, origin: { y: 0.35 } });
    fire();
    const timer = setInterval(fire, 2500);
    return () => clearInterval(timer);
  }, [n]);

  const share = async () => {
    const url = `${location.origin}${location.pathname}${encodeShare(c)}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast('Link gekopieerd! Stuur hem naar oma en opa.');
    } catch {
      prompt('Kopieer deze link:', url);
    }
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <main className="page detail">
      <Scene c={c} />
      <nav className="bar">
        <a className="back" href="#/">
          ‹ Alles
        </a>
        <button className="button" onClick={share}>
          Deel
        </button>
      </nav>
      <p className="detail-emoji">{look.emoji}</p>
      <h1 className="detail-title">{c.title}</h1>
      {n === 0 ? (
        <p className="hero party">Het is zover!</p>
      ) : (
        <>
          <p className="hero">
            <span className="hero-pre">Nog</span>
            <span className="hero-number">{n}</span>
            <span className="hero-post">{nachtjes(n)} slapen!</span>
          </p>
          <ul className="ticker" aria-label="Precies nog">
            {(
              [
                [t.days, 'dagen'],
                [t.hours, 'uur'],
                [t.minutes, 'min'],
                [t.seconds, 'sec'],
              ] as const
            ).map(([v, label]) => (
              <li key={label}>
                <b>{String(v).padStart(2, '0')}</b>
                {label}
              </li>
            ))}
          </ul>
          {m ? (
            <ol className="moons" aria-label={`${m.left} ${nachtjes(m.left)} te gaan`}>
              {Array.from({ length: m.slept + m.left }, (_, i) => (
                <li key={i} className={i < m.slept ? 'slept' : undefined} />
              ))}
            </ol>
          ) : (
            <div className="progress" role="progressbar" aria-valuenow={Math.round(progress(c, now) * 100)}>
              <div style={{ width: `${progress(c, now) * 100}%` }} />
            </div>
          )}
        </>
      )}
      {toast && (
        <p className="toast" role="status">
          {toast}
        </p>
      )}
      <button
        className="link"
        onClick={() => {
          if (confirm(`"${c.title}" verwijderen?`)) onDelete();
        }}
      >
        Verwijderen
      </button>
    </main>
  );
};
