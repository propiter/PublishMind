'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AnimatedCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        ¿Tienes algo que compartir?
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        Puedes crear tu propia publicación o dejar que generemos contenido 
        automáticamente basado en tus ideas. ¡Es fácil y rápido!
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" className="group" asChild>
          <Link href="/crear-publicacion">
            <Sparkles className="mr-2 h-5 w-5" />
            Crear publicación
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="group" asChild>
          <Link href="/ultimas-publicaciones">
            Explorar contenido
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}