// custom.d.ts
interface Document {
  webkitExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  msExitFullscreen?: () => void;
}

interface Element {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}
