// src/components/PhotoGallery.tsx
import { useState } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { type PhotoType } from '../lib/data';

type PhotoGalleryProps = {
    photos: PhotoType[];
};

export function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const breakpointColumnsObj = {
        default: 2, // デフォルトは2カラム
        768: 2,   // 768px以上でも2カラム
    };

    return (
        <>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
            >
                {photos.map((photo, index) => (
                    <div key={photo.src} className="mb-4" onClick={() => openLightbox(index)}>
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="rounded-lg border border-border cursor-pointer transition-opacity hover:opacity-80"
                        />
                    </div>
                ))}
            </Masonry>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={photos}
                index={currentIndex}
            />
        </>
    );
}