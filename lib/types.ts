// Contentful System Fields
interface ContentfulSys {
  space: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: string;
      linkType: string;
    };
  };
  publishedVersion?: number;
  revision: number;
  contentType?: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  locale: string;
}

interface ContentfulMetadata {
  tags: any[];
  concepts: any[];
}

interface ContentfulFile {
  url: string;
  details: {
    size: number;
    image?: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;
}

export interface Imagen {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: {
    title: string;
    description: string;
    file: ContentfulFile;
  };
}

export interface Categoria {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: {
    nombre: string;
    slug: string;
    descripcion: string;
    imagen: Imagen;
  };
}

export interface Publicacion {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: {
    titulo: string;
    slug: string;
    contenido: any; // Rich text format from Contentful
    imagenDestacada: Imagen;
    fechaPublicacion: string;
    autor: string;
    categoria: Categoria;
    tags: string[];
  };
}

export interface ContentfulResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: Publicacion[];
  includes?: {
    Entry?: Categoria[];
    Asset?: Imagen[];
  };
}

export interface PublicacionesResponse {
  items: Publicacion[];
  total: number;
  skip: number;
  limit: number;
}