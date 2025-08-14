import { Section } from '../Section';
import { photoGallery } from '../../lib/data';
import { PhotoGallery } from '../PhotoGallery';

export function GallerySection() {
    return (
        <Section title="Gallery">
            <PhotoGallery photos={photoGallery} />
        </Section>
    );
}