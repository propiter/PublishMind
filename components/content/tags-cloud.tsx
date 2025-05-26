import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TagsCloudProps {
  tags: string[];
  className?: string;
  title?: string;
  limit?: number;
}

export function TagsCloud({ 
  tags, 
  className,
  title = 'Etiquetas populares',
  limit = 30
}: TagsCloudProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Take only the specified limit
  const displayTags = tags.slice(0, limit);

  return (
    <div className={cn('space-y-4', className)}>
      {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
      
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Link 
            key={tag} 
            href={`/etiqueta/${tag}`}
            className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            #{tag}
          </Link>
        ))}
        
        {tags.length > limit && (
          <Link 
            href="/etiquetas"
            className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver todas
          </Link>
        )}
      </div>
    </div>
  );
}