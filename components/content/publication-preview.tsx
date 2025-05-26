import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { renderRichText } from '@/lib/richText';

interface PublicationPreviewProps {
  title: string;
  content: string;
  author?: string;
  date?: Date;
  image?: string | null;
  tags?: string[];
}

export function PublicationPreview({
  title,
  content,
  author,
  date,
  image,
  tags = [],
}: PublicationPreviewProps) {
  return (
    <article className="prose prose-lg dark:prose-invert mx-auto max-w-none">
      {image && (
        <img
          src={image}
          alt={title}
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
      
      <h1>{title}</h1>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {author && <span>Por {author}</span>}
        {date && (
          <time dateTime={date.toISOString()}>
            {format(date, 'dd MMMM, yyyy', { locale: es })}
          </time>
        )}
      </div>
      
      {renderRichText(content)}
      
      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}