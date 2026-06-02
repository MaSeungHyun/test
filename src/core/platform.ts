/** Electron 렌더러(데스크톱 앱)에서만 true — 일반 브라우저(웹)에서는 false */
export function isElectron(): boolean {
  return typeof navigator !== "undefined" && /\belectron\b/i.test(navigator.userAgent);
}
