# DIDz.io, Website Content (Captured March 2, 2026)

**Source**: https://didz.io + https://enterprisezk.com
**Captured by**: Penny 🎀

---

## didz.io, Landing Page

**Headline**: "Revolutionizing Identity Verification with Accuracy, Security, and Privacy"

**Tagline**: Securely authenticate identities, credentials, and other attributes with our innovative 3-part DIDz DApp system.

**CTA**: "Get My DIDz Identity" | "Learn More"

**Identity page**: "Your DIDz Identity gives you full control and privacy for your personal information and data, while allowing you to prove your credentials and other attributes to anyone you wish, and only with your permission."

---

## enterprisezk.com, Main Site

**Headline**: "Making the Foundation For Reimagining the World's Digital Systems"

**Tagline**: Empowering secure, pseudonymous, digital identities, with provable attributes and credentials across various sectors, seamlessly.

### Value Propositions (Three Roles)

1. **Holders**: "Your DIDz (anonymous, digital identity) lets you offer provable, privacy-preserving confirmation of your credentials and attributes, without revealing who you are."

2. **Trusted Issuers**: "Earn revenue for each verification call automatically. Greatly reduce your organization's workload by answering privacy-assuring ZKQueries and verifications safely and automatically when you become a DIDz Trusted Issuer."

3. **Verifiers**: "Are you tired of checking IDs, performing background checks, and endlessly verifying the credentials and attributes of customers, vendors, and employees? Become a DIDz verifier and know in an instant, for sure, and earn revenue on each digital verification call!"

### Target Sectors

- Governments
- Educational Institutions
- DeFi
- Enterprise Corporations
- Commerce
- Supply Chain
- Polling and Voting
- Medical
- Passports & Travel
- Military & Security
- Law Enforcement
- Intelligence Systems

### Technology Stack Description

> "EnterpriseZK is dedicated to alleviating pain points and streamlining enterprise business systems across the globe."

> "The cornerstone of that transformation is the conceptual breakthrough of the DIDz or 'anonymous, digital identifier', which leverages ZKProof technology (z). ZKProofs are cryptographic queries that allow entities to verify identities, credentials, and other attributes with surety, securely, and in a privacy-preserving manner."

> "Adopting the baseline architecture of Hyperledger Identus's DID with anon-cred functionality, EnterpriseZK is implementing its DIDz DApp System on the revolutionary behemoth, Midnight which resides on the incredible, world-renowned Cardano blockchain."

> "With DIDz's privacy-preserving user identities, trusted issuers, and verifiers, we can now create digital systems that were previously unimaginable."

### Contact

- **Phone**: 1+(609)987-6543
- **Email**: info@enterprisezk.com
- **Hours**: 9 AM - 5 PM Mon-Friday

---

*Note: The website uses "DIDz" consistently (capital D-I-D-z). The "z" stands for Zero-knowledge.*

---

## Live-Site Audit (October 12, 2026 — Penny 🎀)

**Hosting**: didz.io is a **Hostinger Website Builder** site (`generator: Hostinger Website Builder`,
Zyro assets, AI-generated template). It is **not** code in any of our repos — all edits happen in
the Hostinger builder UI (hPanel → Websites → Edit website). The long-term plan in
`DEPLOYMENT.md` is to eventually serve the real `didz-ui` DApp from Vercel on this domain.

**Pages live**: `/`, `/get-my-didz-identity`, `/become-a-trusted-issuer`,
`/become-a-didz-credential-verifier`, `/about`, `/under-construction`.

**Matches this doc**: landing headline, tagline, the three role CTAs, and the Identity page
copy are all verbatim what was captured above. The landing page is in good shape.

**Issues to fix in the builder** (all placeholder/AI-template leftovers):

| Page | Issue | Fix |
|------|-------|-----|
| All pages (footer) | Placeholder `didzmail` link and phone `1234567890` | Real email `info@enterprisezk.com`, real phone or remove |
| All pages (footer) | `© 2024. All rights reserved.` | Update to `© 2026 EnterpriseZK Labs LLC` |
| `/become-a-trusted-issuer` | `Phone: 123-123-1234`, `Email: email@email.com` | Real contact details |
| `/become-a-trusted-issuer` | Typo `EnterprizeZK` | `EnterpriseZK` |
| `/become-a-trusted-issuer` | `We effort to respond` | `We strive to respond` (or `We endeavor`) |
| `/about` | Typo `Fill our the form` | `Fill out the form` |
| `/about` | Stock AI-generated photo + "Coming soon!" | Fine for now, or add mission copy |
| `/get-my-didz-identity` | CTA links to `/under-construction` (build-team recruiting page) | Acceptable, but consider a dedicated "not live yet — join the waitlist" page |

**Sticky "not live yet" banner**: Hostinger builder has a native feature — in the editor,
hover the header section and click **Add sticky bar**, enter text, then **Edit section** to
set background color/height, then Update/Publish. Suggested copy:

> 🚧 DIDz is in active development — the DApp is not live yet. Demos & enrollment coming soon.

(Alternative for a dismissible banner: `... → Integrations → Custom code` accepts arbitrary
HTML/CSS/JS injected site-wide.)
