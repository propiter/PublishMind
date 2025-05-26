import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import slugify from 'slugify';
import { FileImage, Loader2, Eye, Calendar, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/content/rich-text-editor';
import { TagInput } from '@/components/content/tag-input';
import { PublicationPreview } from '@/components/content/publication-preview';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Categoria } from '@/lib/types';

const formSchema = z.object({
  titulo: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no debe exceder 100 caracteres'),
  slug: z.string()
    .min(5, 'El slug debe tener al menos 5 caracteres')
    .max(100, 'El slug no debe exceder 100 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  contenido: z.string()
    .min(20, 'El contenido debe tener al menos 20 caracteres'),
  autor: z.string().optional(),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  tags: z.array(z.string()).min(1, 'Agrega al menos una etiqueta'),
  imagen: z.instanceof(File).optional(),
  fechaPublicacion: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PublicationForm({ categorias }: { categorias: Categoria[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [promptIdea, setPromptIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      slug: '',
      contenido: '',
      autor: '',
      categoria: '',
      tags: [],
      fechaPublicacion: new Date(),
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    const title = form.watch('titulo');
    if (title) {
      const generatedSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      });
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [form.watch('titulo')]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch(process.env.N8N_WEBHOOK_MANUAL || '', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al enviar la publicación');

      const data = await response.json();
      
      toast({
        title: "¡Publicación enviada con éxito!",
        description: "Tu publicación está siendo procesada y se publicará pronto.",
      });

      if (data.slug) {
        setTimeout(() => {
          window.location.href = `/publicacion/${data.slug}`;
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la publicación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await fetch(process.env.N8N_WEBHOOK_AUTO || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptIdea,
          category: form.getValues('categoria')
        }),
      });

      if (!response.ok) throw new Error('Error al generar contenido');

      const { title, content } = await response.json();
      
      form.setValue('titulo', title);
      form.setValue('contenido', content);
      
      toast({
        title: "¡Contenido generado!",
        description: "Revisa y edita el contenido generado antes de publicar.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el contenido. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imagen', file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">Modo Manual</TabsTrigger>
        <TabsTrigger value="auto">Modo Automático <Sparkles className="ml-2 h-4 w-4" /></TabsTrigger>
      </TabsList>

      {/* Manual Mode (existing form) */}
      <TabsContent value="manual">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Título y Slug */}
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Un título atractivo para tu publicación..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL amigable (slug)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="url-amigable" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Se genera automáticamente del título, pero puedes editarlo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Autor y Fecha */}
              <div className="grid gap-6 sm:grid-cols-2">
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

                <FormField
                  control={form.control}
                  name="fechaPublicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de publicación</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Por defecto se usa la fecha actual
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        {categorias.map((categoria: Categoria) => (
                          <SelectItem 
                            key={categoria.sys.id} 
                            value={categoria.fields.slug}
                            className="flex items-center gap-2"
                          >
                            {categoria.fields.imagen && (
                              <img
                                src={`https:${categoria.fields.imagen.fields.file.url}`}
                                alt={categoria.fields.nombre}
                                className="h-6 w-6 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{categoria.fields.nombre}</div>
                              {categoria.fields.descripcion && (
                                <div className="text-xs text-muted-foreground">
                                  {categoria.fields.descripcion}
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Etiquetas */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Agrega etiquetas (presiona Enter)"
                        suggestions={[
                          'javascript',
                          'react',
                          'nextjs',
                          'typescript',
                          'programación',
                          'desarrollo web',
                        ]}
                      />
                    </FormControl>
                    <FormDescription>
                      Agrega etiquetas relevantes para clasificar tu contenido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Editor de contenido */}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Imagen destacada */}
              <div>
                <FormLabel htmlFor="imagen">Imagen destacada</FormLabel>
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

              {/* Botones de acción */}
              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Publicar'
                  )}
                </Button>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Vista previa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Vista previa de la publicación</DialogTitle>
                    </DialogHeader>
                    <PublicationPreview
                      title={form.getValues('titulo')}
                      content={form.getValues('contenido')}
                      author={form.getValues('autor')}
                      date={form.getValues('fechaPublicacion')}
                      image={selectedImage}
                      tags={form.getValues('tags')}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
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

          <Form {...form}>
            <form onSubmit={onAutoSubmit} className="space-y-8">
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria: Categoria) => (
                          <SelectItem 
                            key={categoria.sys.id} 
                            value={categoria.fields.slug}
                          >
                            {categoria.fields.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      La categoría ayudará a generar contenido más relevante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prompt Input */}
              <div>
                <Label htmlFor="prompt-idea">Idea para la publicación</Label>
                <Textarea
                  id="prompt-idea"
                  placeholder="Describe de qué quieres que trate la publicación..."
                  value={promptIdea}
                  onChange={(e) => setPromptIdea(e.target.value)}
                  rows={5}
                  className="mt-2 resize-none"
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
        </div>
      </TabsContent>
    </Tabs>
  );
}