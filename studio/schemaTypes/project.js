import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: rule => rule.required().max(100) }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: rule => rule.required().max(350) }),
    defineField({ name: 'url', title: 'Live app URL', type: 'url', validation: rule => rule.required().uri({ scheme: ['https', 'http'] }) }),
    defineField({ name: 'category', type: 'string', description: 'For example: Running tool, Productivity, or Web app.' }),
    defineField({ name: 'year', type: 'number', validation: rule => rule.integer().min(2000).max(2100) }),
    defineField({ name: 'displayOrder', type: 'number', initialValue: 10, description: 'Lower numbers appear first.', validation: rule => rule.integer().min(0) }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: rule => rule.required() })] }),
  ],
  orderings: [{ title: 'Display order', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } },
});
