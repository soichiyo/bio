"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { type PhotoType } from "../lib/data";

type PhotoGalleryProps = {
  photos: PhotoType[];
};

function GalleryImage({
  photo,
  index,
  onOpen,
}: {
  photo: PhotoType;
  index: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="mb-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index % 2 * 0.15 }}
      onClick={() => onOpen(index)}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="rounded-lg border border-border cursor-pointer transition-opacity hover:opacity-80"
      />
    </motion.div>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumnsObj = {
    default: 2,
    768: 2,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {photos.map((photo, index) => (
          <GalleryImage
            key={photo.src}
            photo={photo}
            index={index}
            onOpen={openLightbox}
          />
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
