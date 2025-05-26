'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  platform: 'twitter' | 'facebook' | 'linkedin';
  icon: React.ReactNode;
}

export function ShareButton({ platform, icon }: ShareButtonProps) {
  const handleShare = () => {
    const url = encodeURIComponent(window.location.href);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
        break;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <Button 
      size="icon" 
      variant="outline" 
      className="h-8 w-8 rounded-full"
      onClick={handleShare}
    >
      <span className="sr-only">Compartir en {platform}</span>
      {icon}
    </Button>
  );
}