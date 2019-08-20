import { ThumbnailRaw } from './thumbnail-raw';

export interface BookRaw {
    isbn: string;
    title: string;
    authors: string[];
    published: string;
    subtitle?: string;
    rating?: number;
    thumbnails?: ThumbnailRaw[];
    description?: string;
}
