export type NoteSection = {
  title: string;
  paragraphs: string[];
};

export type Note = {
  slug: string;
  label: string;
  title: string;
  dek: string;
  excerpt: string;
  date: string;
  readTime: string;
  sections: NoteSection[];
};

export const notes: Note[] = [
  {
    slug: "solve-first-scroll-after",
    label: "Product note",
    title: "Solve first, scroll after.",
    dek: "The internet is not the enemy. Bad timing is.",
    excerpt:
      "A short note on why LeetGuard is built around order, not shame: finish one problem, then decide what the rest of the session gets to be.",
    date: "June 30, 2026",
    readTime: "4 min read",
    sections: [
      {
        title: "The tab is not the villain",
        paragraphs: [
          "Most focus tools treat distraction like a moral failure. We think that is the wrong angle. YouTube, Instagram, music, sports, group chats, and every other shiny tab are not inherently bad. They are just very good at arriving before the work has earned its shape.",
          "LeetGuard starts from a smaller belief: the first problem matters. If you can protect the beginning of the session, the rest of the day feels less like a negotiation with your browser.",
        ],
      },
      {
        title: "Order changes the session",
        paragraphs: [
          "The product loop is intentionally simple. Try to drift, hit the guard, solve a problem, unlock the internet again. That order turns the blocked page from a punishment into a gate with a clear exit.",
          "This matters because the goal is not to make users feel trapped. The goal is to make the first useful action easier than the first avoidant one.",
        ],
      },
      {
        title: "Why the guard gets out of the way",
        paragraphs: [
          "A focus app that never lets go becomes another thing to fight. LeetGuard should feel firm while the daily problem is unfinished, then quiet once the user has done the thing they came to do.",
          "That is why progress is central to the experience. The unlock is not decorative. It is the moment the product says: you kept the promise, now choose what comes next.",
        ],
      },
      {
        title: "What these notes are for",
        paragraphs: [
          "This notes section will become the place where we write down product decisions, technical cleanup, launch milestones, weird bugs, and the small design choices that make LeetGuard feel sharper over time.",
          "The first note is a placeholder in the best sense: a stake in the ground. Build in public, keep the thinking visible, and let the product history have somewhere to live.",
        ],
      },
    ],
  },
];

export const featuredNote = notes[0];

export function getNoteBySlug(slug: string) {
  return notes.find((note) => note.slug === slug);
}
