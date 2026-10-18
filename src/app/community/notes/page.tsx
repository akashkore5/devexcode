import type { Metadata } from 'next';
import { constructMetadata } from "@/lib/seo";
import NotesClient from "./NotesClient";

export const metadata: Metadata = constructMetadata({
  title: 'Community Engineering Notes & Study Guides | DevExCode',
  description: 'Explore community-contributed technical notes, cheat sheets, system design summaries, and algorithm study guides on DevExCode.',
  canonicalPath: '/community/notes',
  keywords: ['developer notes', 'engineering cheat sheets', 'coding notes', 'study guides', 'devexcode'],
});

export default function NotesPage() {
  return <NotesClient />;
}
