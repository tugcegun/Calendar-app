import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

const SCROLL_MULTIPLIER = 4.5; // amplify hand movement for scroll

/**
 * Touchscreen-style hand scroll:
 * Hand moves UP → content scrolls DOWN (like dragging on a phone)
 * Finds the scrollable container under the cursor and applies scroll delta.
 */
export function useHandScroll() {
  const cursorPos = useAppStore((s) => s.cursorPos);
  const prevYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!cursorPos) {
      prevYRef.current = null;
      return;
    }

    const currY = cursorPos.y;

    if (prevYRef.current === null) {
      prevYRef.current = currY;
      return;
    }

    // Delta in normalized coords: negative = hand moved up, positive = hand moved down
    const deltaY = currY - prevYRef.current;
    prevYRef.current = currY;

    // Skip tiny movements (jitter)
    if (Math.abs(deltaY) < 0.002) return;

    // Convert to pixels (inverted: hand up → scroll down, like phone)
    const scrollPx = -deltaY * window.innerHeight * SCROLL_MULTIPLIER;

    // Find scrollable element under cursor
    const screenX = (1 - cursorPos.x) * window.innerWidth;
    const screenY = cursorPos.y * window.innerHeight;
    const el = document.elementFromPoint(screenX, screenY);
    if (!el) return;

    const scrollable = findScrollableParent(el as HTMLElement);
    if (scrollable) {
      scrollable.scrollTop += scrollPx;
    }
  }, [cursorPos]);
}

/** Walk up the DOM to find the nearest scrollable ancestor */
function findScrollableParent(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el;
  while (node) {
    if (node === document.body || node === document.documentElement) {
      if (document.documentElement.scrollHeight > window.innerHeight) {
        return document.documentElement;
      }
      return null;
    }
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
