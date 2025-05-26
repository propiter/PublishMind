'use client';

import { Facebook, Instagram, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
    setEmail('');
  };
  
  return (
    <footer className="border-t bg-muted/40">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">PublishMind</h3>
              <p className="text-sm text-muted-foreground">
                Una plataforma moderna de contenido dinámico con publicaciones generadas manualmente y automáticamente.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <p className="text-sm font-medium">Suscríbete al newsletter</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="max-w-[240px]"
                  />
                  <Button type="submit" size="sm">
                    Suscribirse
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Explorar</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href="/categorias" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/etiquetas" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Etiquetas
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ultimas-publicaciones" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Últimas publicaciones
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/populares" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Populares
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Participar</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href="/crear-publicacion" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Crear publicación
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/guia-escritura" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Guía de escritura
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/faq" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contacto" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href="/politica-de-privacidad" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terminos-de-servicio" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Términos de servicio
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cookies" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center gap-6 border-t pt-8">
            <div className="flex space-x-6">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              &copy; {currentYear} PublishMind. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}