import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";
import { getNoteBySlug, notes } from "@/lib/notes";

type NotePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export function generateMetadata({ params }: NotePageProps) {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    return {
      title: "Note not found | LeetGuard",
    };
  }

  return {
    title: `${note.title} | LeetGuard Notes`,
    description: note.excerpt,
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <article className="px-4 pb-20 pt-32 sm:px-6 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-6xl border-t border-gray-200 pt-10 md:pt-14">
          <Link
            href="/notes"
            className="inline-flex items-center text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-black"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            Notes
          </Link>

          <header className="mt-10 grid gap-8 border-b border-gray-200 pb-12 md:mt-14 md:gap-10 md:pb-16 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                {note.label}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-normal leading-none tracking-super-tight text-black sm:text-5xl md:text-7xl">
                {note.title}
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-normal leading-snug text-neutral-700 md:mt-8 md:text-2xl">
                {note.dek}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                published
              </p>
              <p className="mt-3 text-xl font-normal text-black">
                {note.date}
              </p>
              <p className="mt-5 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
                length
              </p>
              <p className="mt-3 text-xl font-normal text-black">
                {note.readTime}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-3xl py-12 md:py-16">
            {note.sections.map((section) => (
              <section key={section.title} className="mb-14 last:mb-0">
                <h2 className="text-2xl font-normal leading-tight text-black md:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-6 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-lg leading-relaxed text-neutral-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
            <Link
              href="/notes"
              className="group inline-flex items-center text-sm font-medium text-black"
            >
              More notes
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
