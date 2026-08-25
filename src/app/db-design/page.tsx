import { Metadata } from 'next';
import DbDesignClient from './DbDesignClient';

export const metadata: Metadata = {
  title: 'DB Schema Designer - DevExCode',
  description:
    'Design and visualize database schemas visually. Write SQL CREATE TABLE statements and instantly see a live ERD with FK relationships. Save your designs to the cloud.',
  keywords: 'database schema designer, ERD, entity relationship diagram, SQL visualizer, DB design tool',
};

export default function DbDesignPage() {
  return <DbDesignClient />;
}
