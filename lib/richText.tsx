import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import Link from 'next/link';

// Options for rendering rich text content from Contentful
export const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="mb-6 mt-10 text-4xl font-bold tracking-tight">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="mb-4 mt-8 text-3xl font-bold tracking-tight">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="mb-4 mt-6 text-2xl font-bold tracking-tight">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="mb-4 mt-6 text-xl font-semibold tracking-tight">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="mb-4 mt-4 text-lg font-semibold tracking-tight">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="mb-4 mt-4 text-base font-semibold tracking-tight">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="mb-6 ml-6 list-disc space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="leading-relaxed">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-primary pl-4 italic">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-t border-border" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { title, description, file } = node.data.target.fields;
      const { url, details, contentType } = file;
      
      if (contentType.includes('image')) {
        return (
          <figure className="my-8">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={`https:${url}`}
                alt={description || title || 'Imagen'}
                width={details.image.width}
                height={details.image.height}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {description && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {description}
              </figcaption>
            )}
          </figure>
        );
      }
      return null;
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
      const { uri } = node.data;
      const isExternal = !uri.startsWith('/');
      
      return (
        <Link
          href={uri}
          className="text-primary underline transition-colors hover:text-primary/80"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </Link>
      );
    },
  },
};

// Helper function to render Contentful rich text
export const renderRichText = (content: any) => {
  return documentToReactComponents(content, renderOptions);
};