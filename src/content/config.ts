import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  loader: async () => {
    const res = await fetch('https://bostonsafetyequipment.com/products.json');
    const data = await res.json();

    return data.products.map((product: any) => ({
      id: product.handle,
      title: product.title,
      handle: product.handle,
      description: product.body_html,
      productType: product.product_type,
      vendor: product.vendor,
      tags: product.tags || [],
      images: product.images.map((img: any) => ({
        src: img.src,
        alt: img.alt || product.title,
      })),
      variants: product.variants.map((v: any) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        available: v.available,
        sku: v.sku,
      })),
    }));
  },
  schema: z.object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    description: z.string().nullable(),
    productType: z.string(),
    vendor: z.string(),
    tags: z.array(z.string()),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })),
    variants: z.array(z.object({
      id: z.number(),
      title: z.string(),
      price: z.string(),
      available: z.boolean(),
      sku: z.string().nullable(),
    })),
  }),
});

export const collections = { products };
