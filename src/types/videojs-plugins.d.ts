import 'video.js';

declare module 'video.js' {
  export interface VideoJsPlayer {
    httpSourceSelector?: (options?: {
      displayCurrentQuality?: boolean;
      defaultQuality?: 'auto' | number;
    }) => void;
  }
}
