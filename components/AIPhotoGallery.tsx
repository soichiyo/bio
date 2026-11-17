"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { photoGallery } from "@/content/photos";
export function AIPhotoGallery() {
  const [index, setIndex] = useState(-1);
  return <><div className="grid grid-cols-3 gap-3">{photoGallery.map((photo, i) => <button key={photo.src} type="button" onClick={() => setIndex(i)} aria-label={`${photo.alt}を拡大`}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="aspect-[3/4] w-full object-cover" /></button>)}</div><Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={photoGallery} /></>;
}
