import type { FrontendTopic } from "../types";
import { PARTS } from "../types";
import { partA } from "./part-a";
import { partB } from "./part-b";
import { partC } from "./part-c";
import { partD } from "./part-d";
import { partE } from "./part-e";
import { partF } from "./part-f";
import { partG } from "./part-g";
import { partH } from "./part-h";
import { partI } from "./part-i";
import { partJ } from "./part-j";
import { partK } from "./part-k";
import { partL } from "./part-l";
import { partM } from "./part-m";
import { partN } from "./part-n";
import { partO } from "./part-o";
import { partP } from "./part-p";

export { PARTS };
export type { FrontendTopic };

/** All 59 handbook topics, in handbook order. */
export const ALL_TOPICS: FrontendTopic[] = [
  ...partA,
  ...partB,
  ...partC,
  ...partD,
  ...partE,
  ...partF,
  ...partG,
  ...partH,
  ...partI,
  ...partJ,
  ...partK,
  ...partL,
  ...partM,
  ...partN,
  ...partO,
  ...partP,
].sort((a, b) => a.num - b.num);

export function getTopic(id: string): FrontendTopic | undefined {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function getAllTopicIds(): string[] {
  return ALL_TOPICS.map((t) => t.id);
}

/** Topics grouped by their part, preserving PARTS order. */
export function getTopicsByPart(): { partId: string; name: string; tagline: string; topics: FrontendTopic[] }[] {
  return PARTS.map((p) => ({
    partId: p.id,
    name: p.name,
    tagline: p.tagline,
    topics: ALL_TOPICS.filter((t) => t.partId === p.id).sort((a, b) => a.num - b.num),
  })).filter((g) => g.topics.length > 0);
}

/** Returns the previous and next topic (by handbook order) for detail-page nav. */
export function getAdjacentTopics(id: string): { prev?: FrontendTopic; next?: FrontendTopic } {
  const idx = ALL_TOPICS.findIndex((t) => t.id === id);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? ALL_TOPICS[idx - 1] : undefined,
    next: idx < ALL_TOPICS.length - 1 ? ALL_TOPICS[idx + 1] : undefined,
  };
}
