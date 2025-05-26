'use client';

import { Button } from '@/components/ui/button';

export function ScrollToTopButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="text-sm"
    >
      Volver arriba
    </Button>
  );
}