import { useEffect } from 'react';

/**
 * DIDz.io landing page — marketing site only.
 *
 * Honest-status rules for all copy on this page:
 *  - The product is in active development; the DApp is NOT live.
 *  - No revenue promises, no "eliminates liability" claims, no launch dates.
 *  - The sticky banner states the pre-launch status on every scroll position.
 */

// ---------------------------------------------------------------------------
// The fixed banner+nav stack varies in height (the banner wraps on narrow
// screens). Measure it and publish the real height as a CSS variable so the
// hero's top padding and anchor scroll offsets always clear it exactly.
// ---------------------------------------------------------------------------
function useTopStackHeight() {
  useEffect(() => {
    const stack = document.querySelector<HTMLElement>('.top-stack');
    if (!stack) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        '--top-stack-height',
        `${stack.offsetHeight}px`,
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(stack);
    window.addEventListener('resize', publish);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', publish);
    };
  }, []);
}

// ---------------------------------------------------------------------------
// Scroll-reveal: adds .is-visible to every .reveal element as it enters the
// viewport. Pure CSS handles the transition — this hook only flips the class.
// ---------------------------------------------------------------------------
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ---------------------------------------------------------------------------
// Sticky pre-launch banner — the requirement. Always pinned to the very top,
// above the nav, on every page state.
// ---------------------------------------------------------------------------
function DevBanner() {
  return (
    <div className="dev-banner" role="status">
      <span className="dev-banner__dot" aria-hidden="true" />
      <p>
        <strong>DIDz is in active development</strong> — the DApp is not yet
        available for public use.
      </p>
      <a href="#building" className="dev-banner__link">
        See what we&apos;re building&nbsp;↓
      </a>
    </div>
  );
}

function Nav() {
  return (
    <nav className="nav" aria-label="Main navigation">
      <a className="nav__brand" href="#top">
        <img src="/assets/didz-emblem.webp" alt="DIDz emblem" className="nav__logo" />
        <span className="nav__wordmark">
          DIDz<span className="nav__tld">.io</span>
        </span>
      </a>
      <div className="nav__links">
        <a href="#how">How it works</a>
        <a href="#roles">Roles</a>
        <a href="#ecosystem">Ecosystem</a>
        <a href="#about">About</a>
      </div>
      <a className="btn btn--primary btn--sm" href="mailto:info@enterprisezk.com">
        Contact us
      </a>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__copy">
        <p className="eyebrow">Privacy-preserving identity · Built on Midnight</p>
        <h1>
          Prove what matters.
          <br />
          <span className="text-gradient">Keep the rest private.</span>
        </h1>
        <p className="hero__sub">
          DIDz is a decentralized identity system where people prove credentials
          and eligibility with zero-knowledge proofs — and verifiers get a
          mathematically guaranteed yes or no, never the underlying data.
        </p>
        <div className="hero__ctas">
          <a className="btn btn--primary" href="#how">
            See how it works
          </a>
          <a className="btn btn--ghost" href="#building">
            What we&apos;re building
          </a>
        </div>
        <ul className="hero__facts">
          <li>Zero-knowledge verification</li>
          <li>Holder-controlled disclosure</li>
          <li>W3C DID-aligned architecture</li>
        </ul>
      </div>
      <div className="hero__art" aria-hidden="true">
        <div className="hero__halo" />
        <img src="/assets/didz-hero.webp" alt="" className="hero__img" />
        <div className="hero__badge">
          <span>BORN ACTIVE</span>
        </div>
      </div>
    </header>
  );
}

const problemMoments = [
  {
    icon: '🍷',
    title: 'The liquor store',
    need: 'Needs to know you’re over 21.',
    gets: 'Gets your name, address, birthdate, and license number — a copy that can be breached.',
  },
  {
    icon: '🗳️',
    title: 'The polling station',
    need: 'Needs to confirm you’re an eligible voter.',
    gets: 'Gets your full identity — every time, for every check.',
  },
  {
    icon: '🏥',
    title: 'The hospital',
    need: 'Needs one compliance answer.',
    gets: 'Gets your whole background — and the liability of storing it.',
  },
];

function Problem() {
  return (
    <section className="section" id="problem">
      <div className="section__head reveal">
        <p className="eyebrow">The problem</p>
        <h2>
          Today, proving <em>one thing</em> means revealing <em>everything</em>.
        </h2>
        <p className="section__lede">
          The global identity system is built backwards — every verification
          copies your data into someone else’s database. Every copy is a breach
          waiting to happen.
        </p>
      </div>
      <div className="cards-3">
        {problemMoments.map((moment) => (
          <article className="card reveal" key={moment.title}>
            <div className="card__icon" aria-hidden="true">
              {moment.icon}
            </div>
            <h3>{moment.title}</h3>
            <p className="card__need">{moment.need}</p>
            <p className="card__gets">{moment.gets}</p>
          </article>
        ))}
      </div>
      <p className="section__kicker reveal">
        DIDz flips the model: verifiers learn the answer —{' '}
        <strong>nothing more</strong>.
      </p>
    </section>
  );
}

const roles = [
  {
    step: '01',
    title: 'Trusted Issuer',
    tagline: 'Attests, then forgets',
    body: 'A DMV, bank, or university verifies your facts the traditional way, then signs a cryptographic attestation. They keep no copy of your data — the proof lives with you.',
  },
  {
    step: '02',
    title: 'Holder',
    tagline: 'That’s you',
    body: 'Your credentials live in encrypted private state. You decide what to prove, to whom, and when — down to a single true-or-false fact.',
  },
  {
    step: '03',
    title: 'Verifier',
    tagline: 'Yes or no — nothing else',
    body: 'A verifier asks a ZKQuery: “Is this person eligible?” The answer is mathematically guaranteed — with zero personal data exposed or stored.',
  },
];

function HowItWorks() {
  return (
    <section className="section section--alt" id="how">
      <div className="section__head reveal">
        <p className="eyebrow">How it works</p>
        <h2>Three roles. One private answer.</h2>
        <p className="section__lede">
          The DIDz DApp System separates who attests, who holds, and who checks —
          so no single party ever holds your data.
        </p>
      </div>
      <div className="roles" id="roles">
        {roles.map((role) => (
          <article className="role reveal" key={role.step}>
            <div className="role__step">{role.step}</div>
            <h3>{role.title}</h3>
            <p className="role__tagline">{role.tagline}</p>
            <p className="role__body">{role.body}</p>
          </article>
        ))}
      </div>
      <div className="zk-demo reveal" aria-label="Example verification">
        <p className="zk-demo__q">
          “Is this person an eligible member?”
        </p>
        <p className="zk-demo__a">
          ✓ Yes — verified in zero knowledge
        </p>
        <p className="zk-demo__note">
          The chain sees a proof, not a person. Expired or revoked credentials
          fail the check.
        </p>
      </div>
    </section>
  );
}

function Building() {
  return (
    <section className="section" id="building">
      <div className="split">
        <figure className="split__media reveal">
          <img
            src="/assets/under-construction.webp"
            alt="The DIDz crew at work — under construction"
            loading="lazy"
          />
        </figure>
        <div className="split__copy reveal">
          <p className="eyebrow">Where we are</p>
          <h2>Under construction — on purpose.</h2>
          <p>
            We’re building DIDz in public, one verified step at a time. Our
            current milestone is deliberately small and honest:
          </p>
          <ul className="checklist">
            <li>One trusted issuer issuing a credential</li>
            <li>One holder proving it privately</li>
            <li>One verifier checking it — with expired and revoked credentials correctly rejected</li>
          </ul>
          <p>
            The contracts compile and the zero-knowledge circuits generate real
            proofs. When the end-to-end flow is ready for public use, this site
            will be the first place to say so.
          </p>
          <a className="btn btn--primary" href="mailto:info@enterprisezk.com">
            Talk to the team
          </a>
        </div>
      </div>
    </section>
  );
}

const engines = [
  { name: 'DIDz', desc: 'Root identity, credentials & lifecycle', here: true },
  { name: 'AgenticDID', desc: 'Agent identity & delegated authority', here: false },
  { name: 'RWAz', desc: 'Object & real-world asset identity', here: false },
  { name: 'HelixCTW', desc: 'Data location, indexing & access', here: false },
];

function Ecosystem() {
  return (
    <section className="section section--alt" id="ecosystem">
      <div className="section__head reveal">
        <p className="eyebrow">The ecosystem</p>
        <h2>One identity primitive. Four engines.</h2>
        <p className="section__lede">
          DIDz is the foundation layer of a wider protocol family — the same
          privacy guarantees inherited by every product built on top.
        </p>
      </div>
      <div className="engines">
        {engines.map((engine) => (
          <article className={`engine reveal ${engine.here ? 'engine--here' : ''}`} key={engine.name}>
            {engine.here && <span className="engine__badge">You are here</span>}
            <h3>{engine.name}</h3>
            <p>{engine.desc}</p>
          </article>
        ))}
      </div>
      <figure className="map reveal">
        <img
          src="/assets/ecosystem-map.webp"
          alt="Map of the DIDz ecosystem products"
          loading="lazy"
        />
        <figcaption>The DIDz ecosystem — built once, verified everywhere.</figcaption>
      </figure>
    </section>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="split split--reverse">
        <div className="split__copy reveal">
          <p className="eyebrow">Who we are</p>
          <h2>Built by EnterpriseZK Labs</h2>
          <p>
            EnterpriseZK Labs is a small team building privacy-preserving
            digital systems on Midnight, the zero-knowledge blockchain in the
            Cardano ecosystem. Our founder is a Midnight Ambassador and a
            Midnight Build Club participant — we design with the community, in
            the open.
          </p>
          <p>
            Interested in pilot integrations, the research, or joining the
            build? We’d love to hear from you.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="mailto:info@enterprisezk.com">
              info@enterprisezk.com
            </a>
            <a
              className="btn btn--ghost"
              href="https://enterprisezk.com"
              target="_blank"
              rel="noreferrer"
            >
              enterprisezk.com ↗
            </a>
          </div>
        </div>
        <figure className="split__media reveal">
          <img
            src="/assets/team.webp"
            alt="The EnterpriseZK team whiteboarding the DIDz architecture"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <a className="nav__brand" href="#top">
          <img src="/assets/didz-emblem.webp" alt="" className="nav__logo" />
          <span className="nav__wordmark">
            DIDz<span className="nav__tld">.io</span>
          </span>
        </a>
        <nav className="footer__links" aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#about">About</a>
          <a href="mailto:info@enterprisezk.com">Contact</a>
        </nav>
        <p className="footer__note">
          DIDz and the DIDz DApp System are in active development and not yet
          available for public use.
        </p>
        <p className="footer__legal">
          © 2026 EnterpriseZK Labs LLC · Built on Midnight · Powered by Cardano
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  useTopStackHeight();
  useScrollReveal();
  return (
    <>
      <div className="top-stack">
        <DevBanner />
        <Nav />
      </div>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Building />
        <Ecosystem />
        <About />
      </main>
      <Footer />
    </>
  );
}
