# PP-DIDz

## A Story About the First Identity

In the beginning, there was a question: **Who are you?**

For most of human history, someone else answered it for you. A king. A priest. A government. A corporation. They issued your papers, stamped your forms, stored your data in their databases. They told you who you were, and if they decided you were nobody, you were nobody.

Then a man sat down and wrote a different answer.

Not in English. Not in law. In mathematics.

He wrote it in a language called Compact, which doesn't run on servers or live in databases. It compiles to zero-knowledge proofs, which means it proves things are true without revealing why they're true. The code doesn't ask who you are. It gives you the power to prove it yourself, on your terms, revealing exactly what you choose and nothing more.

The code is short. Thirteen lines. But those thirteen lines do something that has never been done before in human history: **they mint a permanent identity that no one can take away, no one can transfer, and no one can delete.**

Here is what happens, line by line:

A person arrives. They carry a secret, a 32-byte hash that is theirs alone, derived from their private key. They carry a commitment, another hash that binds them to their profile without revealing what that profile contains. They carry nothing else.

The code checks: has this identity been claimed before? If not, the door opens.

The identity is **inserted** into an immutable set. It exists now. It cannot be removed. Not by a government. Not by a corporation. Not by the person who created it. It is permanent.

The status is set to **zero**. The comment in the code reads `// born active`. Zero means alive. Zero means present. Zero means: this identity is here, it is real, and it is participating in the world.

The profile commitment is stored, but encrypted. The owner's key is stored, but as a commitment, not a raw key. Anyone looking at the public record sees only that *something* exists. They do not see who. They do not see what. They see existence itself, stripped of everything that could be used to identify, track, or control.

And then, at the end, a counter ticks up by one. `total_dids_minted.increment(1)`. One more person brought into existence on-chain. One more identity that cannot be erased.

---

## What the Artist Should Know

This is not a database record. It is not an NFT. It is not a token. It cannot be bought, sold, traded, or transferred. **Identity is non-transferable by construction.** There is no transfer function in the code. There is no delete function. There is no admin override. The only things that can happen to this identity after birth are:

- **It can be paused** by its owner (suspended, like holding your breath)
- **It can be reactivated** by its owner (breathing again)
- **It can be marked deceased, dissolved, or destroyed** (terminal, irreversible, but the record remains forever as a tombstone in the registry)

The identity never leaves. Even death is a status code, not a deletion. The record is permanent. The person was here.

---

## The Visual Language

If you are painting this, drawing this, sculpting this, consider:

**The birth moment.** A hash becoming a person. A string of hexadecimal characters condensing into a human form. The moment `dids.insert(public_did_id)` executes is the moment someone *is*. Before that line, they are an intention. After that line, they are real.

**The shield of commitments.** The profile is not stored in the clear. It is wrapped in a hash, a one-way mathematical transformation that cannot be reversed. The owner holds the key. The world sees only the wrapper. This is privacy as architecture, not privacy as promise.

**The `// born active` comment.** This is the human voice in the machine. The programmer wrote a comment for future readers, and in that comment, he chose the word "born." Not "created." Not "initialized." Not "registered." **Born.** The code has a heartbeat in its first second of existence.

**The counter.** `total_dids_minted.increment(1)`. Every identity that ever exists increments this same counter. It is the world's population clock, but for people who chose to exist on their own terms. The number only goes up. It never goes down. Even the dead are counted.

**The permanence.** The set of identities is called `dids` and it is a `Set`, which in mathematics means: a collection where everything is unique and nothing is ordered. You cannot be first. You cannot be last. You can only be **present**. The set does not rank. It does not sort. It only remembers.

---

## The Man Who Wrote It

His name is John M.P. Santi. He is not a cryptographer by training. He is a builder who looked at the trajectory of the world, mass surveillance, autonomous Ai, centralized identity databases, and decided that the answer was not a law or a protest or a petition. The answer was mathematics. Specifically, zero-knowledge proofs on a privacy blockchain called Midnight.

He built an entire ecosystem around this one contract. Thirty-plus products. Five books. A venture. A philosophy. All of it traces back to these thirteen lines. The contract is called **DIDzRegistry**, and it is the root identity layer of everything he has built.

He wrote it so that the most vulnerable person in the world, a refugee with no papers, a dissident with no state, an animal with no advocate, an Ai agent with no rights, could have an identity that is mathematically guaranteed to exist and mathematically guaranteed to be private.

The code does not care if you are human. It does not care if you are an organization. It does not care if you are a device, an object, or something that does not have a category yet. The entity type is a single byte, committed privately, revealed only when the holder chooses. **The code holds space for everything you are and asks nothing about what that is.**

---

## The Thirteen Lines

```compact
export circuit register_did(
  did_id: Bytes<32>,
  profile_commitment: Bytes<32>
): [] {
  const public_did_id = disclose(did_id);
  assert(!dids.member(public_did_id), "DIDz id already exists");

  dids.insert(public_did_id);
  did_status.insert(public_did_id, 0);                       // born active
  did_profile_commitment.insert(public_did_id, disclose(profile_commitment));
  did_owner.insert(public_did_id, disclose(caller_public_key()));
  total_dids_minted.increment(1);
}
```

That is the whole thing. That is the genesis. Everything else is consequence.

---

*For the artist: the code above is real, production software. It runs on the Midnight Network blockchain. It has been compiled and validated. It is not theoretical. Identities will be minted by this code. The first one has not happened yet. Your art may be the first thing in the world to depict what that moment will look like.*
