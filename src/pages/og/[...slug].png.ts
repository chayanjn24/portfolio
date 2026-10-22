/**
 * Link-preview cards, one PNG per page, generated at build time from the content files.
 * To change what a card says, edit the matching entry below (or the content it reads from).
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderCard, type Card } from '@lib/og-card';
import { site } from '@content/site';
import { hero } from '@content/home';
import { intro } from '@content/about';
import { contact } from '@content/contact';
import { projects, workPage } from '@content/projects';
import { badge } from '@lib/projects';
import { fill, plain } from '@lib/text';

type Content = Omit<Card, 'domain' | 'firstName' | 'lastName'>;

export const getStaticPaths = (() => {
  const pages: [string, Content][] = [
    ['index', { label: '(00) Portfolio — Data & business analyst', title: hero.headline.join(' '), sub: hero.bio }],
    ['work', { label: fill(workPage.label), title: 'Work*.*', sub: plain(workPage.lead) }],
    ['about', { label: '(03) About — Guwahati ⇄ Pune', title: intro.headline.join(' '), sub: plain(intro.lead) }],
    ['resume', { label: '(04) Résumé — Data & business analyst', title: 'Résumé*.*', sub: '$2.6M+ revenue portfolio · 32% YoY growth · SQL, Python, Power BI, Tableau' }],
    ['contact', { label: '(05) Contact', title: contact.headline.join(' '), sub: plain(contact.lead) }],
    ...projects.map((p): [string, Content] => [
      `work/${p.id}`,
      {
        label: `(${p.num}) ${p.kind}`,
        title: p.title,
        badge: badge(p, true).text,
        stat: p.status === 'shipped' && p.results?.[0] ? p.results[0] : undefined,
        sub: p.summary,
      },
    ]),
  ];
  return pages.map(([slug, card]) => ({ params: { slug }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, site: siteUrl }) => {
  const png = await renderCard({
    ...(props.card as Content),
    domain: (siteUrl?.host ?? '').replace(/^www\./, ''),
    firstName: site.firstName,
    lastName: site.lastName,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
