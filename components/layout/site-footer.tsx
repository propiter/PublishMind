import { Facebook, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">PublishMind</h3>
            <p className="text-sm text-muted-foreground">
              Una plataforma moderna de contenido dinámico con publicaciones generadas manualmente y automáticamente.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Navegar</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Inicio
                </Link>
              </li>
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
                  Explorar etiquetas
                </Link>
              </li>
              <li>
                <Link 
                  href="/buscar" 
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Buscar
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contenido</h3>
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
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} PublishMind. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}