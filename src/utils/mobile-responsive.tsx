export function mobileQuery() {
    return tabletQuery();
  }
  
  export function tabletQuery() {
    return `(max-width: 64em)`;
  }
  
  export function phoneQuery() {
    return `(max-width: 36em)`;
  }
  
  export function usePhoneSized<T = any>(inputUseElementSize: any): { boundRef: React.RefObject<T>; isPhone: boolean } {
    const { ref, width } = inputUseElementSize();
    return { boundRef: ref, isPhone: isPhoneSized(width) };
  }
  
  export function isPhoneSized(width: number): boolean {
    return width < 36 * 16;
  }