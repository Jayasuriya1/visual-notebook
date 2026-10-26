declare module 'youtube-captions-scraper' {
  export interface CaptionTrackItem {
    start: string;
    dur: string;
    text: string;
  }
  export function getSubtitles(options: {
    videoID: string;
    lang?: string;
  }): Promise<CaptionTrackItem[]>;
}
