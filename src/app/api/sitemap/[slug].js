import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { slug } = req.query;
  const filePath = path.join(process.cwd(), 'public', `${slug}.xml`);

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(fileContents);
    } else {
      res.status(404).json({ error: 'Sitemap not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}