import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  addBringItem,
  addProposal,
  averageStars,
  deleteProposal,
  markNext,
  pastMeetings,
  rankedProposals,
  rate,
  saveMeeting,
  setRsvp,
  signIn,
  toggleBring,
  toggleVote,
  upcomingMeeting,
  type Book,
  type Meeting,
  type MeetingDraft,
  type Member,
  type Rsvp,
  type State,
} from './club';
import { ORGANISER } from './seed';
import { loadSession, loadState, saveSession, saveState } from './storage';

type Page = 'start' | 'boekenkast' | 'voorstellen';

const pageFromHash = (): Page => {
  const h = location.hash.replace('#/', '');
  return h === 'boekenkast' || h === 'voorstellen' ? h : 'start';
};

const dateFmt = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('nl-BE', { hour: '2-digit', minute: '2-digit' });
const shortDateFmt = new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
const decimal = new Intl.NumberFormat('nl-BE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function App() {
  const [state, setState] = useState<State>(() => loadState(new Date()));
  const [email, setEmail] = useState<string | null>(loadSession);
  const [page, setPage] = useState<Page>(pageFromHash);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => saveState(state), [state]);
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const me = state.members.find((m) => m.email === email);

  const act = (f: (s: State) => State) => {
    try {
      setState(f(state));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (!me)
    return (
      <Login
        onSignIn={(address) => {
          const { state: next, member } = signIn(state, address);
          setState(next);
          setEmail(member.email);
          saveSession(member.email);
        }}
      />
    );

  const nameOf = (address: string) => state.members.find((m) => m.email === address)?.name ?? address;
  const signOut = () => {
    saveSession(null);
    setEmail(null);
  };

  return (
    <div className="shell">
      <header className="masthead">
        <a href="#/" className="brand">
          <span className="brand-small">Leesclub</span>
          <span className="brand-name">De Bladwijzer</span>
        </a>
        <div className="who">
          {me.name}
          {me.organiser && <span className="tag">organisator</span>}
          <button className="link" onClick={signOut}>
            Afmelden
          </button>
        </div>
      </header>
      <nav className="tabs">
        <a href="#/" aria-current={page === 'start' ? 'page' : undefined}>
          Bijeenkomst
        </a>
        <a href="#/boekenkast" aria-current={page === 'boekenkast' ? 'page' : undefined}>
          Boekenkast
        </a>
        <a href="#/voorstellen" aria-current={page === 'voorstellen' ? 'page' : undefined}>
          Voorstellen
        </a>
      </nav>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <main>
        {page === 'start' && <Start state={state} me={me} nameOf={nameOf} act={act} />}
        {page === 'boekenkast' && <Bookshelf state={state} me={me} nameOf={nameOf} act={act} />}
        {page === 'voorstellen' && <Proposals state={state} me={me} nameOf={nameOf} act={act} />}
      </main>
    </div>
  );
}

interface PageProps {
  state: State;
  me: Member;
  nameOf: (email: string) => string;
  act: (f: (s: State) => State) => void;
}

function Login({ onSignIn }: { onSignIn: (email: string) => void }) {
  const [address, setAddress] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.trim())) return setError('Dat is geen geldig e-mailadres.');
    setError(null);
    setSent(address.trim());
  };

  return (
    <div className="login">
      <p className="brand-small">Leesclub</p>
      <h1 className="login-title">De Bladwijzer</h1>
      {!sent ? (
        <form onSubmit={submit} className="card stack">
          <label htmlFor="email">Je e-mailadres</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="naam@voorbeeld.be"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button className="primary">Stuur me een magische link</button>
          <p className="muted small">Geen wachtwoord nodig. Je krijgt een link in je mailbox.</p>
          <p className="muted small">
            Proberen als organisator? Gebruik <button type="button" className="link" onClick={() => setAddress(ORGANISER)}>{ORGANISER}</button>.
          </p>
        </form>
      ) : (
        <div className="card stack">
          <p>
            We stuurden een link naar <strong>{sent}</strong>.
          </p>
          <div className="mail">
            <p className="muted small">Van: Leesclub De Bladwijzer · Onderwerp: Je magische link</p>
            <p>Dag! Klik hieronder om je aan te melden bij de leesclub.</p>
            <button className="primary" onClick={() => onSignIn(sent)}>
              Meld me aan
            </button>
          </div>
          <button className="link" onClick={() => setSent(null)}>
            Ander e-mailadres
          </button>
        </div>
      )}
    </div>
  );
}

function Cover({ book, size = 'm' }: { book: Book; size?: 's' | 'm' | 'l' }) {
  const [failed, setFailed] = useState(!book.cover);
  if (failed)
    return (
      <div className={`cover cover-${size} cover-blank`} aria-label={`Kaft van ${book.title}`}>
        <span>{book.title}</span>
        <small>{book.author}</small>
      </div>
    );
  return <img className={`cover cover-${size}`} src={book.cover} alt={`Kaft van ${book.title}`} onError={() => setFailed(true)} />;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} op 5 sterren`}>
      {'★★★★★'.slice(0, Math.round(value))}
      <span className="stars-off">{'★★★★★'.slice(Math.round(value))}</span>
    </span>
  );
}

const RSVP_LABELS: [Rsvp, string][] = [
  ['ja', 'Ik kom'],
  ['nee', 'Ik kom niet'],
  ['misschien', 'Misschien'],
];

function Start({ state, me, nameOf, act }: PageProps) {
  const meeting = upcomingMeeting(state, new Date());
  const [editing, setEditing] = useState<MeetingDraft | null>(null);
  const [extra, setExtra] = useState('');

  const nextProposal = state.proposals.find((p) => p.next);
  const newDraft = (): MeetingDraft => ({
    date: '',
    address: '',
    host: me.email,
    book: { title: nextProposal?.title ?? '', author: nextProposal?.author ?? '', cover: '' },
  });

  if (editing)
    return (
      <MeetingForm
        draft={editing}
        members={state.members}
        onCancel={() => setEditing(null)}
        onSave={(d) => {
          act((s) => saveMeeting(s, me.email, d));
          setEditing(null);
        }}
      />
    );

  if (!meeting)
    return (
      <section className="card empty">
        <p className="eyebrow">Volgende bijeenkomst</p>
        <h2>Nog niet gepland</h2>
        <p className="muted">De organisator prikt binnenkort een nieuwe datum.</p>
        {me.organiser && (
          <button className="primary" onClick={() => setEditing(newDraft())}>
            Nieuwe bijeenkomst
          </button>
        )}
      </section>
    );

  const date = new Date(meeting.date);
  const by = (r: Rsvp) => Object.entries(meeting.rsvps).filter(([, v]) => v === r).map(([k]) => nameOf(k));
  const mine = meeting.rsvps[me.email];

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Volgende bijeenkomst</p>
        <div className="hero-body">
          <Cover book={meeting.book} size="l" />
          <div className="stack">
            <h1 className="book-title">{meeting.book.title}</h1>
            <p className="author">{meeting.book.author}</p>
            <dl className="facts">
              <dt>Wanneer</dt>
              <dd>
                {dateFmt.format(date)}
                <br />
                om {timeFmt.format(date)}
              </dd>
              <dt>Waar</dt>
              <dd>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meeting.address)}`} target="_blank" rel="noreferrer">
                  {meeting.address}
                </a>
              </dd>
              <dt>Gastheer of gastvrouw</dt>
              <dd>{nameOf(meeting.host)}</dd>
            </dl>
          </div>
        </div>
        {me.organiser && (
          <div className="row">
            <button className="ghost" onClick={() => setEditing({ id: meeting.id, date: meeting.date, address: meeting.address, host: meeting.host, book: meeting.book })}>
              Aanpassen
            </button>
            <button className="ghost" onClick={() => setEditing(newDraft())}>
              Nieuwe bijeenkomst
            </button>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Kom je?</h2>
        <div className="rsvp">
          {RSVP_LABELS.map(([value, label]) => (
            <button key={value} className={mine === value ? 'choice chosen' : 'choice'} aria-pressed={mine === value} onClick={() => act((s) => setRsvp(s, meeting.id, me.email, value))}>
              {label}
            </button>
          ))}
        </div>
        <Attendance label="Komen" names={by('ja')} />
        <Attendance label="Misschien" names={by('misschien')} />
        <Attendance label="Komen niet" names={by('nee')} />
      </section>

      <section className="card">
        <h2>Wie brengt wat?</h2>
        <ul className="bring">
          {meeting.bring.map((item) => {
            const taken = item.by !== null && item.by !== me.email;
            return (
              <li key={item.id} className={taken ? 'taken' : undefined}>
                <label>
                  <input type="checkbox" checked={item.by !== null} disabled={taken} onChange={() => act((s) => toggleBring(s, meeting.id, item.id, me.email))} />
                  <span>{item.label}</span>
                </label>
                <span className="muted small">{item.by === me.email ? 'jij' : item.by ? nameOf(item.by) : ''}</span>
              </li>
            );
          })}
        </ul>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            act((s) => addBringItem(s, meeting.id, extra, me.email));
            setExtra('');
          }}
        >
          <input aria-label="Iets anders meebrengen" placeholder="Iets anders…" value={extra} onChange={(e) => setExtra(e.target.value)} />
          <button className="ghost">Ik breng het mee</button>
        </form>
      </section>
    </>
  );
}

function Attendance({ label, names }: { label: string; names: string[] }) {
  if (names.length === 0) return null;
  return (
    <p className="attendance">
      <span className="eyebrow">
        {label} ({names.length})
      </span>
      {names.join(', ')}
    </p>
  );
}

function MeetingForm({ draft, members, onSave, onCancel }: { draft: MeetingDraft; members: Member[]; onSave: (d: MeetingDraft) => void; onCancel: () => void }) {
  const [d, setD] = useState(draft);
  const [day, time] = d.date ? d.date.split('T') : ['', '20:00'];
  const setBook = (patch: Partial<Book>) => setD({ ...d, book: { ...d.book, ...patch } });

  return (
    <form
      className="card stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(d);
      }}
    >
      <h2>{draft.id ? 'Bijeenkomst aanpassen' : 'Nieuwe bijeenkomst'}</h2>
      <div className="grid2">
        <Field label="Datum">
          <input type="date" required value={day} onChange={(e) => setD({ ...d, date: `${e.target.value}T${time}` })} />
        </Field>
        <Field label="Uur">
          <input type="time" required value={time} onChange={(e) => setD({ ...d, date: `${day}T${e.target.value}` })} />
        </Field>
      </div>
      <Field label="Adres">
        <input required value={d.address} onChange={(e) => setD({ ...d, address: e.target.value })} />
      </Field>
      <Field label="Gastheer of gastvrouw">
        <select value={d.host} onChange={(e) => setD({ ...d, host: e.target.value })}>
          {members.map((m) => (
            <option key={m.email} value={m.email}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Titel van het boek">
        <input required value={d.book.title} onChange={(e) => setBook({ title: e.target.value })} />
      </Field>
      <Field label="Auteur">
        <input required value={d.book.author} onChange={(e) => setBook({ author: e.target.value })} />
      </Field>
      <Field label="Link naar de kaft (optioneel)">
        <input type="url" value={d.book.cover} onChange={(e) => setBook({ cover: e.target.value })} />
      </Field>
      <div className="row">
        <button className="primary">Bewaren</button>
        <button type="button" className="ghost" onClick={onCancel}>
          Annuleren
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Bookshelf({ state, me, nameOf, act }: PageProps) {
  const meetings = pastMeetings(state, new Date());
  return (
    <>
      <h1 className="page-title">Boekenkast</h1>
      <p className="muted intro">Alles wat we samen gelezen hebben, het nieuwste eerst.</p>
      {meetings.length === 0 && <p className="muted">Nog geen boeken gelezen.</p>}
      {meetings.map((m) => (
        <ShelfItem key={m.id} meeting={m} me={me} nameOf={nameOf} act={act} />
      ))}
    </>
  );
}

function ShelfItem({ meeting, me, nameOf, act }: { meeting: Meeting } & Omit<PageProps, 'state'>) {
  const avg = averageStars(meeting);
  const own = meeting.reviews[me.email];
  const [stars, setStars] = useState(own?.stars ?? 0);
  const [opinion, setOpinion] = useState(own?.opinion ?? '');
  const others = Object.entries(meeting.reviews).filter(([k]) => k !== me.email);

  return (
    <article className="card shelf">
      <div className="shelf-head">
        <Cover book={meeting.book} />
        <div>
          <h2 className="book-title">{meeting.book.title}</h2>
          <p className="author">{meeting.book.author}</p>
          <p className="muted small">Besproken op {shortDateFmt.format(new Date(meeting.date))}</p>
          {avg !== undefined ? (
            <p className="average">
              <Stars value={avg} /> <strong>{decimal.format(avg)}</strong>
              <span className="muted small"> · {Object.keys(meeting.reviews).length} scores</span>
            </p>
          ) : (
            <p className="muted small">Nog geen scores</p>
          )}
        </div>
      </div>
      <ul className="reviews">
        {others.map(([email, r]) => (
          <li key={email}>
            <span className="reviewer">{nameOf(email)}</span> <Stars value={r.stars} />
            {r.opinion && <q>{r.opinion}</q>}
          </li>
        ))}
      </ul>
      <form
        className="my-review"
        onSubmit={(e) => {
          e.preventDefault();
          act((s) => rate(s, meeting.id, me.email, stars, opinion));
        }}
      >
        <span className="eyebrow">Jouw score</span>
        <div className="star-picker" role="radiogroup" aria-label="Jouw score">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} role="radio" aria-checked={stars === n} aria-label={`${n} sterren`} className={n <= stars ? 'on' : undefined} onClick={() => setStars(n)}>
              ★
            </button>
          ))}
        </div>
        <div className="row">
          <input aria-label="Jouw mening in één regel" placeholder="Je mening in één regel" maxLength={120} value={opinion} onChange={(e) => setOpinion(e.target.value)} />
          <button className="ghost" disabled={stars === 0}>
            {own ? 'Bijwerken' : 'Bewaren'}
          </button>
        </div>
      </form>
    </article>
  );
}

function Proposals({ state, me, nameOf, act }: PageProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  return (
    <>
      <h1 className="page-title">Voorstellen</h1>
      <p className="muted intro">Wat lezen we hierna? Stel een boek voor of geef een duimpje.</p>
      <form
        className="card stack"
        onSubmit={(e) => {
          e.preventDefault();
          act((s) => addProposal(s, me.email, title, author));
          setTitle('');
          setAuthor('');
        }}
      >
        <div className="grid2">
          <input aria-label="Titel" placeholder="Titel" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <input aria-label="Auteur" placeholder="Auteur" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <button className="primary">Stel voor</button>
      </form>
      <ol className="proposals">
        {rankedProposals(state).map((p) => {
          const voted = p.votes.includes(me.email);
          return (
            <li key={p.id} className={p.next ? 'card proposal next' : 'card proposal'}>
              <button className={voted ? 'thumb voted' : 'thumb'} aria-pressed={voted} aria-label={voted ? 'Duimpje intrekken' : 'Duimpje geven'} onClick={() => act((s) => toggleVote(s, p.id, me.email))}>
                <span aria-hidden="true">👍</span>
                <span>{p.votes.length}</span>
              </button>
              <div className="proposal-body">
                {p.next && <span className="tag">volgende boek</span>}
                <h2 className="book-title">{p.title}</h2>
                {p.author && <p className="author">{p.author}</p>}
                <p className="muted small">voorgesteld door {p.by === me.email ? 'jou' : nameOf(p.by)}</p>
                <div className="row">
                  {me.organiser && (
                    <button className="link" onClick={() => act((s) => markNext(s, me.email, p.id))}>
                      {p.next ? 'Niet meer volgende boek' : 'Markeer als volgende boek'}
                    </button>
                  )}
                  {p.by === me.email && (
                    <button className="link danger" onClick={() => act((s) => deleteProposal(s, me.email, p.id))}>
                      Verwijderen
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
