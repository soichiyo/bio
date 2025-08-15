import { photoGallery } from '../../lib/data';
import { PhotoGallery } from '../PhotoGallery';

export function GallerySection() {
    return <PhotoGallery photos={photoGallery} />;
}