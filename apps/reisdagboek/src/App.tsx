import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { geocode, resizePhoto } from './browser';
import { Lightbox } from './Lightbox';
import { RouteMap } from './RouteMap';
import { credits, sampleTrip } from './sample';
import { confirmLogin, loadTrips, owner as loadOwner, requestLogin, saveTrips, signOut } from './store';
import {
  addComment,
  dayOf,
  excerpt,
  formatDate,
  formatDay,
  MAX_PHOTOS,
  MOODS,
  renderStory,
  route,
  tripDates,
  updateDay,
  type Trip,
} from './trip';

const storage = localStorage;
const tilt = (i: number) => [-2.2, 1.6, -1.1, 2.4, -1.7, 0.9][i % 6];
const go = (path: string) => void (location.hash = path);

function useHash() {
  const [hash, setHash] = useState(location.hash.slice(1) || '/');
  useEffect(() => {
    const on = () => {
      setHash(location.hash.slice(1) || '/');
      scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export function App() {
  const hash = useHash();
  const [trips, setTrips] = useState(() => loadTrips(storage));
  const [me, setMe] = useState(() => loadOwner(storage));

  const commit = (next: Trip[]) => {
    try {
      saveTrips(storage, next);
      setTrips(next);
      return true;
    } catch {
      alert('Het geheugen van je browser is vol. Gebruik minder of kleinere foto’s.');
      return false;
    }
  };
  const saveTrip = (trip: Trip) =>
    commit(trips.some((t) => t.id === trip.id) ? trips.map((t) => (t.id === trip.id ? trip : t)) : [...trips, trip]);

  const parts = hash.split('/').filter(Boolean);
  const trip = parts[0] === 'reis' ? trips.find((t) => t.id === parts[1]) : undefined;
  const date = parts[2] === 'dag' ? parts[3] : undefined;
  const editing = parts.at(-1) === 'bewerk';
  const needsOwner = editing || parts[0] === 'nieuw';

  let page: ReactNode;
  if (needsOwner && !me) page = <Login />;
  else if (parts[0] === 'aanmelden' && parts[1]) page = <Confirm token={parts[1]} onLogin={setMe} />;
  else if (parts[0] === 'aanmelden') page = <Login />;
  else if (parts[0] === 'nieuw') page = <TripForm onSave={saveTrip} />;
  else if (parts[0] === 'reis' && !trip) page = <Missing />;
  else if (trip && date && editing) page = <DayForm trip={trip} date={date} onSave={saveTrip} />;
  else if (trip && date) page = <DayPage trip={trip} date={date} isOwner={!!me} onSave={saveTrip} />;
  else if (trip && editing) page = <TripForm trip={trip} onSave={saveTrip} />;
  else if (trip) page = <TripPage trip={trip} isOwner={!!me} />;
  else page = <Home trips={trips} isOwner={!!me} />;

  return (
    <>
      <header className="topbar">
        <a href="#/" className="brand">
          <span aria-hidden>📔</span> Reisdagboek
        </a>
        {me ? (
          <span className="who">
            <span className="who-mail">{me}</span>
            <button
              className="link"
              onClick={() => {
                signOut(storage);
                setMe(null);
              }}
            >
              Afmelden
            </button>
          </span>
        ) : (
          <a href="#/aanmelden" className="link">
            Aanmelden
          </a>
        )}
      </header>
      <main>{page}</main>
      <footer className="credits">
        <details>
          <summary>Voorbeeldfoto’s: Wikimedia Commons · Kaart: © OpenStreetMap</summary>
          <ul>
            {credits.map(([file, author, licence, source]) => (
              <li key={file}>
                <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(source)}`}>{file}</a> — {author},{' '}
                {licence}
              </li>
            ))}
          </ul>
        </details>
      </footer>
    </>
  );
}

function Home({ trips, isOwner }: { trips: Trip[]; isOwner: boolean }) {
  return (
    <section className="home">
      <h1 className="hand">Onze reizen</h1>
      <div className="trip-grid">
        {trips.map((t, i) => (
          <a key={t.id} href={`#/reis/${t.id}`} className="trip-card" style={{ rotate: `${tilt(i)}deg` }}>
            <div className="polaroid">{t.cover ? <img src={t.cover} alt="" /> : <div className="no-photo">🧳</div>}</div>
            <span className="hand trip-card-title">{t.title}</span>
            <span className="muted">
              {t.region} · {formatDate(t.start)}
            </span>
          </a>
        ))}
        {isOwner && (
          <a href="#/nieuw" className="trip-card new">
            <span className="plus">+</span>
            <span className="hand trip-card-title">Nieuwe reis</span>
          </a>
        )}
      </div>
    </section>
  );
}

function TripPage({ trip, isOwner }: { trip: Trip; isOwner: boolean }) {
  const dates = tripDates(trip.start, trip.end);
  const stops = useMemo(() => route(trip), [trip]);
  const pick = useCallback((d: string) => go(`/reis/${trip.id}/dag/${d}`), [trip.id]);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}#/reis/${trip.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article>
      <header className="hero">
        {trip.cover && <img src={trip.cover} alt="" className="hero-img" />}
        <div className="hero-text">
          <h1 className="hand">{trip.title}</h1>
          <p>
            {trip.region} · {formatDate(trip.start)} – {formatDate(trip.end)}
          </p>
        </div>
      </header>

      <div className="actions">
        <button className="btn" onClick={share}>
          {copied ? '✓ Link gekopieerd' : '🔗 Deel'}
        </button>
        {isOwner && (
          <a className="btn ghost" href={`#/reis/${trip.id}/bewerk`}>
            ✏️ Reis aanpassen
          </a>
        )}
      </div>
      {isOwner && trip.id !== sampleTrip.id && (
        <p className="note">Deze reis is enkel in deze browser bewaard: de deellink werkt alleen op dit toestel.</p>
      )}

      <RouteMap stops={stops} onPick={pick} />

      <ol className="timeline">
        {dates.map((d, i) => {
          const day = dayOf(trip, d);
          const empty = !day.title && !day.story && day.photos.length === 0;
          return (
            <li key={d}>
              <a href={`#/reis/${trip.id}/dag/${d}`} className={`day-card${empty ? ' empty' : ''}`}>
                {day.photos[0] && (
                  <div className="polaroid small" style={{ rotate: `${tilt(i)}deg` }}>
                    <img src={day.photos[0]} alt="" loading="lazy" />
                  </div>
                )}
                <div className="day-card-text">
                  <span className="day-date">
                    Dag {i + 1} · {formatDay(d)}
                  </span>
                  <h2 className="hand">
                    {day.title || (isOwner ? 'Nog leeg, schrijf iets…' : 'Nog niets geschreven')}{' '}
                    {day.mood && <span className="mood">{day.mood}</span>}
                  </h2>
                  {day.place && <span className="place">📍 {day.place}</span>}
                  {day.story && <p>{excerpt(day.story, 140)}</p>}
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

function DayPage({ trip, date, isOwner, onSave }: { trip: Trip; date: string; isOwner: boolean; onSave: (t: Trip) => boolean }) {
  const dates = tripDates(trip.start, trip.end);
  const i = dates.indexOf(date);
  const day = dayOf(trip, date);
  const [open, setOpen] = useState<number | null>(null);
  const [name, setName] = useState(() => storage.getItem('reisdagboek.naam') ?? '');
  const [text, setText] = useState('');

  if (i < 0) return <Missing />;

  const comment = (e: FormEvent) => {
    e.preventDefault();
    if (onSave(addComment(trip, date, name, text, new Date().toISOString()))) {
      storage.setItem('reisdagboek.naam', name.trim());
      setText('');
    }
  };

  return (
    <article className="day">
      <nav className="crumbs">
        <a href={`#/reis/${trip.id}`}>← {trip.title}</a>
      </nav>
      <header className="day-head">
        <span className="day-date">
          Dag {i + 1} · {formatDay(date)}
        </span>
        <h1 className="hand">
          {day.title || 'Nog geen titel'} {day.mood && <span className="mood">{day.mood}</span>}
        </h1>
        {day.place && <span className="place">📍 {day.place}</span>}
        {isOwner && (
          <a className="btn ghost small" href={`#/reis/${trip.id}/dag/${date}/bewerk`}>
            ✏️ Dag aanpassen
          </a>
        )}
      </header>

      {day.story && <div className="story paper" dangerouslySetInnerHTML={{ __html: renderStory(day.story) }} />}

      {day.photos.length > 0 && (
        <div className="gallery">
          {day.photos.map((src, n) => (
            <button key={n} className="polaroid taped" style={{ rotate: `${tilt(n + i)}deg` }} onClick={() => setOpen(n)}>
              <img src={src} alt={`Foto ${n + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {open !== null && <Lightbox photos={day.photos} start={open} onClose={() => setOpen(null)} />}

      <section className="comments">
        <h2 className="hand">Reacties</h2>
        {day.comments.length === 0 && <p className="muted">Nog geen reacties. Wees de eerste!</p>}
        <ul>
          {day.comments.map((c) => (
            <li key={c.id} className="comment">
              <p>{c.text}</p>
              <span className="hand comment-name">— {c.name}</span>
            </li>
          ))}
        </ul>
        <form className="comment-form" onSubmit={comment}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Je naam" maxLength={40} required />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Laat een berichtje achter…"
            maxLength={500}
            rows={2}
            required
          />
          <button className="btn">Plaats reactie</button>
        </form>
      </section>

      <nav className="pager">
        {i > 0 ? <a href={`#/reis/${trip.id}/dag/${dates[i - 1]}`}>← Dag {i}</a> : <span />}
        {i < dates.length - 1 && <a href={`#/reis/${trip.id}/dag/${dates[i + 1]}`}>Dag {i + 2} →</a>}
      </nav>
    </article>
  );
}

function TripForm({ trip, onSave }: { trip?: Trip; onSave: (t: Trip) => boolean }) {
  const [title, setTitle] = useState(trip?.title ?? '');
  const [region, setRegion] = useState(trip?.region ?? '');
  const [start, setStart] = useState(trip?.start ?? '');
  const [end, setEnd] = useState(trip?.end ?? '');
  const [cover, setCover] = useState(trip?.cover ?? '');
  const tooLong = start && end && tripDates(start, end).length > 60;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = trip?.id ?? crypto.randomUUID().slice(0, 8);
    if (onSave({ id, days: {}, ...trip, title, region, start, end, cover })) go(`/reis/${id}`);
  };

  return (
    <form className="form paper" onSubmit={submit}>
      <h1 className="hand">{trip ? 'Reis aanpassen' : 'Nieuwe reis'}</h1>
      <label>
        Titel
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Zomer in de Provence" required />
      </label>
      <label>
        Land of streek
        <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Provence, Frankrijk" required />
      </label>
      <div className="row">
        <label>
          Van
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          Tot
          <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} required />
        </label>
      </div>
      {tooLong && <p className="warn">Een reis kan maximaal 60 dagen duren.</p>}
      <label>
        Omslagfoto
        <input type="file" accept="image/*" onChange={async (e) => e.target.files?.[0] && setCover(await resizePhoto(e.target.files[0]))} />
      </label>
      {cover && <img src={cover} alt="" className="cover-preview" />}
      <div className="actions">
        <button className="btn" disabled={!!tooLong}>
          Bewaar
        </button>
        <a className="btn ghost" href={trip ? `#/reis/${trip.id}` : '#/'}>
          Annuleer
        </a>
      </div>
    </form>
  );
}

function DayForm({ trip, date, onSave }: { trip: Trip; date: string; onSave: (t: Trip) => boolean }) {
  const day = dayOf(trip, date);
  const [title, setTitle] = useState(day.title);
  const [mood, setMood] = useState(day.mood);
  const [place, setPlace] = useState(day.place);
  const [story, setStory] = useState(day.story);
  const [photos, setPhotos] = useState(day.photos);
  const [busy, setBusy] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  const wrap = (mark: string) => {
    const a = area.current!;
    const { selectionStart: s, selectionEnd: e } = a;
    setStory(story.slice(0, s) + mark + story.slice(s, e) + mark + story.slice(e));
    requestAnimationFrame(() => {
      a.focus();
      a.setSelectionRange(s + mark.length, e + mark.length);
    });
  };

  const add = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true);
    const room = MAX_PHOTOS - photos.length;
    const resized = await Promise.all([...files].slice(0, room).map(resizePhoto));
    setPhotos((p) => [...p, ...resized]);
    setBusy(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const moved = place.trim() !== day.place || day.lat == null;
    const where = !place.trim() ? null : moved ? await geocode(place) : { lat: day.lat!, lng: day.lng! };
    setBusy(false);
    const next = updateDay(trip, date, { title, mood, place: place.trim(), story, photos, lat: where?.lat, lng: where?.lng });
    if (onSave(next)) go(`/reis/${trip.id}/dag/${date}`);
  };

  return (
    <form className="form paper" onSubmit={submit}>
      <h1 className="hand">{formatDay(date)}</h1>
      <label>
        Titel van de dag
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ciao Firenze!" maxLength={60} />
      </label>
      <fieldset className="moods">
        <legend>Stemming</legend>
        {MOODS.map((m) => (
          <button type="button" key={m} className={m === mood ? 'on' : ''} onClick={() => setMood(m === mood ? '' : m)}>
            {m}
          </button>
        ))}
      </fieldset>
      <label>
        Waar waren we?
        <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Siena" />
      </label>
      <label>
        Verhaal
        <span className="toolbar">
          <button type="button" onClick={() => wrap('**')}>
            <b>V</b>
          </button>
          <button type="button" onClick={() => wrap('*')}>
            <i>S</i>
          </button>
          <span className="muted">Lege regel = nieuwe alinea</span>
        </span>
        <textarea ref={area} value={story} onChange={(e) => setStory(e.target.value)} rows={10} />
      </label>
      <div>
        <span className="label">
          Foto’s ({photos.length}/{MAX_PHOTOS})
        </span>
        <div className="photo-edit">
          {photos.map((src, n) => (
            <div key={n} className="polaroid small">
              <img src={src} alt="" />
              <button type="button" aria-label="Verwijder foto" onClick={() => setPhotos(photos.filter((_, k) => k !== n))}>
                ✕
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="add-photo">
              +
              <input type="file" accept="image/*" multiple onChange={(e) => add(e.target.files)} hidden />
            </label>
          )}
        </div>
      </div>
      <div className="actions">
        <button className="btn" disabled={busy}>
          {busy ? 'Even geduld…' : 'Bewaar'}
        </button>
        <a className="btn ghost" href={`#/reis/${trip.id}/dag/${date}`}>
          Annuleer
        </a>
      </div>
    </form>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);

  if (token)
    return (
      <section className="form paper narrow">
        <h1 className="hand">Kijk in je mailbox ✉️</h1>
        <p>
          We stuurden een aanmeldlink naar <strong>{email}</strong>.
        </p>
        <p className="note">
          Deze demo heeft geen mailserver. Hier is de link die in de mail zou staan:{' '}
          <a href={`#/aanmelden/${token}`}>Aanmelden bij Reisdagboek</a>
        </p>
      </section>
    );

  return (
    <form
      className="form paper narrow"
      onSubmit={(e) => {
        e.preventDefault();
        setToken(requestLogin(storage, email));
      }}
    >
      <h1 className="hand">Aanmelden</h1>
      <p>Geen wachtwoord nodig: we sturen je een magische link.</p>
      <label>
        E-mailadres
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </label>
      <button className="btn">Stuur mij een link</button>
    </form>
  );
}

function Confirm({ token, onLogin }: { token: string; onLogin: (email: string) => void }) {
  const [email] = useState(() => confirmLogin(storage, token));
  useEffect(() => {
    if (email) {
      onLogin(email);
      go('/');
    }
  }, [email, onLogin]);
  return email ? null : (
    <section className="form paper narrow">
      <h1 className="hand">Deze link werkt niet meer</h1>
      <a href="#/aanmelden">Vraag een nieuwe link aan</a>
    </section>
  );
}

function Missing() {
  return (
    <section className="form paper narrow">
      <h1 className="hand">Reis niet gevonden</h1>
      <p>Deze reis staat niet op dit toestel.</p>
      <a href="#/">Naar alle reizen</a>
    </section>
  );
}
