"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, FileImage, Send, Sparkles, Bot } from 'lucide-react';

import { SiteHeader } from '@/components/layout/site-header';
import { RichTextEditor } from '@/components/content/rich-text-editor';
import { getCategorias } from '@/lib/contentful';
import { Categoria } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100, 'El título no debe exceder 100 caracteres'),
  contenido: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
  autor: z.string().optional(),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  tags: z.string().optional(),
  imagen: z.instanceof(File).optional(),
});

export default function CrearPublicacionPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [promptIdea, setPromptIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      contenido: '',
      autor: '',
      categoria: '',
      tags: '',
    },
  });
  
  // Load categories on mount
  useState(() => {
    async function loadCategorias() {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData as unknown as Categoria[]);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    
    loadCategorias();
  });
  
  // Handle image selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    
    if (file) {
      form.setValue('imagen', file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  }
  
  // Handle manual form submission
  async function onManualSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('titulo', values.titulo);
      formData.append('contenido', values.contenido);
      formData.append('categoria', values.categoria);
      
      if (values.autor) {
        formData.append('autor', values.autor);
      }
      
      if (values.tags) {
        formData.append('tags', values.tags);
      }
      
      if (values.imagen) {
        formData.append('imagen', values.imagen);
      }
      
      // Fetch n8n webhook
      const response = await fetch(process.env.N8N_WEBHOOK_MANUAL || '', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const { toast } = useToast();
        toast({
          title: "¡Publicación enviada!",
          description: "Tu publicación está siendo procesada y se publicará pronto.",
        });
        
        if (data.slug) {
          // Redirect to preview page or show success message
          setTimeout(() => {
            router.push(`/publicacion/${data.slug}`);
          }, 2000);
        } else {
          // Stay on the form page but show success message
          form.reset();
          setSelectedImage(null);
        }
      } else {
        throw new Error('Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const { toast } = useToast();
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la publicación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Handle auto-generated content submission
  async function onAutoSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!promptIdea.trim()) {
      const { toast } = useToast();
      toast({
        title: "Error",
        description: "Por favor, describe sobre qué quieres la publicación.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Fetch n8n webhook for auto-generation
      const response = await fetch(process.env.N8N_WEBHOOK_AUTO || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptIdea,
          categoria: form.getValues('categoria'),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const { toast } = useToast();
        toast({
          title: "¡Solicitud enviada!",
          description: "Estamos generando tu publicación, esto puede tardar unos minutos.",
        });
        
        if (data.slug) {
          // Redirect to preview or published page
          setTimeout(() => {
            router.push(`/publicacion/${data.slug}`);
          }, 3000);
        } else {
          // Show success message
          setPromptIdea('');
        }
      } else {
        throw new Error('Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      const { toast } = useToast();
      toast({
        title: "Error",
        description: "Ocurrió un error al generar la publicación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <div className="pb-16 pt-36 md:pt-40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Crear publicación
            </h1>
            <p className="text-muted-foreground">
              Comparte tu conocimiento, historias o experiencias con nuestra comunidad.
            </p>
          </div>
          
          <Tabs defaultValue="manual" className="space-y-8" onValueChange={(value) => setMode(value as 'manual' | 'auto')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Modo Manual
              </TabsTrigger>
              <TabsTrigger value="auto" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Modo Automático
              </TabsTrigger>
            </TabsList>
            
            {/* Manual Mode */}
            <TabsContent value="manual">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <FormProvider {...form}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-8">
                      {/* Título */}
                      <FormField
                        control={form.control}
                        name="titulo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Escribe un título atractivo..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Contenido */}
                      <FormField
                        control={form.control}
                        name="contenido"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contenido</FormLabel>
                            <FormControl>
                              <RichTextEditor 
                                content={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              Usa el editor para dar formato a tu contenido.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Autor */}
                      <FormField
                        control={form.control}
                        name="autor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Autor (opcional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Tu nombre o seudónimo" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Categoría */}
                      <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoría</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categorias.map((categoria) => (
                                  <SelectItem 
                                    key={categoria.sys.id} 
                                    value={categoria.fields.slug}
                                  >
                                    {categoria.fields.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Tags */}
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Etiquetas (opcional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Separa las etiquetas con comas (ej: tecnología, programación, web)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Las etiquetas ayudan a clasificar y encontrar tu contenido.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Imagen */}
                      <div>
                        <FormLabel htmlFor="imagen">Imagen destacada (opcional)</FormLabel>
                        <div className="mt-2">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('imagen')?.click()}
                              className="flex items-center gap-2"
                            >
                              <FileImage className="h-4 w-4" />
                              Seleccionar imagen
                            </Button>
                            <input
                              id="imagen"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            {selectedImage && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedImage(null);
                                  form.setValue('imagen', undefined);
                                }}
                              >
                                Eliminar
                              </Button>
                            )}
                          </div>
                          
                          {selectedImage && (
                            <div className="mt-4 aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                              <img 
                                src={selectedImage} 
                                alt="Vista previa" 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Submit Button */}
                      <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          'Enviar publicación'
                        )}
                      </Button>
                    </form>
                  </Form>
                </FormProvider>
              </div>
            </TabsContent>
            
            {/* Auto Mode */}
            <TabsContent value="auto">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-semibold">
                    Generación automática de contenido
                  </h2>
                  <p className="text-muted-foreground">
                    Describe de qué quieres que trate la publicación y nosotros generaremos el contenido por ti.
                  </p>
                </div>
                
                <FormProvider {...form}>
                  <Form {...form}>
                    <form onSubmit={onAutoSubmit} className="space-y-8">
                      {/* Category Selection */}
                      <div>
                        <FormLabel htmlFor="categoria-auto">Categoría</FormLabel>
                        <Select 
                          onValueChange={(value) => form.setValue('categoria', value)}
                        >
                          <SelectTrigger id="categoria-auto">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((categoria) => (
                              <SelectItem 
                                key={categoria.sys.id} 
                                value={categoria.fields.slug}
                              >
                                {categoria.fields.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="mt-1 text-sm text-muted-foreground">
                          La categoría ayudará a generar contenido más relevante.
                        </p>
                      </div>
                      
                      {/* Prompt Input */}
                      <div>
                        <FormLabel htmlFor="prompt-idea">Idea para la publicación</FormLabel>
                        <Textarea
                          id="prompt-idea"
                          placeholder="Describe de qué quieres que trate la publicación. Por ejemplo: 'Una guía sobre los beneficios del yoga para principiantes' o 'Las 5 tendencias tecnológicas más importantes de 2025'..."
                          value={promptIdea}
                          onChange={(e) => setPromptIdea(e.target.value)}
                          rows={5}
                          className="resize-none"
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto"
                        disabled={isGenerating || !promptIdea.trim() || !form.getValues('categoria')}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generar publicación
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </FormProvider>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}