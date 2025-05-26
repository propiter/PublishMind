'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AnimatedHero() {
  return (
    <div className="text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
      >
        Descubre, crea y comparte conocimiento
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
      >
        Una plataforma donde el contenido se adapta a tus intereses y donde
        puedes compartir tus ideas con el mundo.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Button size="lg" className="group" asChild>
          <Link href="/crear-publicacion">
            <Sparkles className="mr-2 h-5 w-5" />
            Crear publicación
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="group" asChild>
          <Link href="/ultimas-publicaciones">
            Explorar contenido
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}