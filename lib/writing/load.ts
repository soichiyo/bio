import "server-only";
import { unstable_cache } from "next/cache";
import { writings } from "@/content/writing";
import { fetchFeed, loadWriting } from "./load-core";
import { WRITING_REVALIDATE } from "./sources";

const readers = {
  zenn: unstable_cache(() => fetchFeed("zenn"), ["bio-writing-zenn-v1"], {
    revalidate: WRITING_REVALIDATE, tags:["bio-writing-zenn"],
  }),
  note: unstable_cache(() => fetchFeed("note"), ["bio-writing-note-v1"], {
    revalidate: WRITING_REVALIDATE, tags:["bio-writing-note"],
  }),
};
export function getWriting() { return loadWriting(readers,writings); }
