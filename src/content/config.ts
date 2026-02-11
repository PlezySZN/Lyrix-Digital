/**
 * ═══════════════════════════════════════════════════════════
 * CONTENT CONFIG — LYRIX OS
 *
 * Defines Astro Content Collections used across the site.
 * Currently: 'blog' collection for markdown blog posts.
 *
 * How it works:
 *   1. Place .md files in src/content/blog/
 *   2. Astro validates frontmatter against this Zod schema at build time
 *   3. Invalid frontmatter = build error (catches typos early)
 *   4. Pages query collections via getCollection('blog')
 *
 * To add a new collection (e.g., 'projects', 'testimonials'):
 *   1. Define a new collection below with defineCollection()
 *   2. Add it to the `collections` export
 *   3. Create a matching folder: src/content/{name}/
 *   4. Query it in pages via getCollection('{name}')
 *
 * Schema notes:
 *   - lang: 'en' | 'es' — posts are filtered by this, one file per language
 *   - draft: true — excluded from production builds (still accessible in dev)
 *   - date: parsed as a JS Date object from YYYY-MM-DD frontmatter
 *   - slug is derived from the FILENAME, not the title
 * ═══════════════════════════════════════════════════════════
 */

import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lastUpdated: z.date().optional(),
    author: z.string().default('Lyrix Digital'),
    lang: z.enum(['en', 'es']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
