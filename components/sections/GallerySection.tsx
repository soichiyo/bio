import { photoGallery } from '../../lib/data';
import { PhotoGallery } from '../PhotoGallery';

export function GallerySection() {
    return (
        <div>
            <p className="text-muted-foreground mb-6">
                Sony α7III + SIGMA Art 50mm F1.4 + FE 135mm F1.8 GM
            </p>
            <PhotoGallery photos={photoGallery} />
        </div>
    );
}
