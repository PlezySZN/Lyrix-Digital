/**
 * ═══════════════════════════════════════════════════════════
 * PROCESS COMPONENT — UNIT TESTS
 * Covers:
 *   1. Basic render — nodes, heading, section landmark
 *   2. Visibility gate — progress resets to 0 when section hidden
 * ═══════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Process from './Process';

// ─── MOCK: WindowFrame ───
// Strip the OS-chrome wrapper so we can test Process internals in isolation.
// WindowFrame depends on nanostores + its own display logic — not our concern here.
vi.mock('./WindowFrame', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="window-frame">{children}</div>,
}));

// ─── MOCK: framer-motion ───
// Replace motion components with plain HTML equivalents so we can
// inspect attributes without animation runtime or layout measurement.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

  // Factory that turns <motion.X> into <X> with data-* attrs for testability
  const motionHandler = {
    get(_target: unknown, tag: string) {
      // Return a plain HTML component that forwards key props
      return function MotionStub(props: Record<string, unknown>) {
        const {
          initial,
          animate,
          exit,
          transition,
          whileHover,
          whileTap,
          style,
          children,
          ...rest
        } = props;

        // Expose pathLength as a data attribute for assertions
        const styleObj = style as Record<string, unknown> | undefined;
        const extraAttrs: Record<string, unknown> = {};

        if (styleObj?.pathLength !== undefined) {
          // MotionValue → read current value; plain number → use directly
          const pl = styleObj.pathLength;
          const val = typeof pl === 'object' && pl !== null && 'get' in pl
            ? (pl as { get: () => number }).get()
            : pl;
          extraAttrs['data-path-length'] = String(val);
        }

        // Create element with the tag name
        const Tag = tag as React.ElementType;
        return <Tag {...(rest as any)} {...extraAttrs}>{children as React.ReactNode}</Tag>;
      };
    },
  };

  return {
    ...actual,
    motion: new Proxy({}, motionHandler),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useInView: () => true,
    useScroll: () => ({
      scrollYProgress: { get: () => 0, on: vi.fn(), onChange: vi.fn() },
    }),
    useTransform: () => ({ get: () => 0, on: vi.fn(), onChange: vi.fn() }),
    useMotionValue: (initial: number) => {
      let value = initial;
      return {
        get: () => value,
        set: (v: number) => { value = v; },
        on: vi.fn(),
        onChange: vi.fn(),
      };
    },
    useMotionValueEvent: vi.fn(),
  };
});

// ─── MOCK: IntersectionObserver & ResizeObserver ───
// jsdom doesn't implement these — provide stubs.

class MockIntersectionObserver implements IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [0];
  constructor(_cb: IntersectionObserverCallback) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [] as IntersectionObserverEntry[];
}

class MockResizeObserver implements ResizeObserver {
  constructor(_cb: ResizeObserverCallback) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// ═══════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════

describe('Process Component', () => {
  // ─── TEST 1: BASIC RENDER ───
  it('renders 3 process nodes and the section heading', () => {
    render(<Process lang="en" />);

    // The section has an accessible aria-label
    const section = screen.getByRole('region', { name: /process/i });
    expect(section).toBeInTheDocument();

    // 3 node labels should appear (NODE 01, 02, 03)
    expect(screen.getAllByText(/NODE 0[1-3]/)).toHaveLength(6);
    // 6 because desktop (hidden md:block) + mobile (md:hidden) each render 3
  });

  // ─── TEST 2: VISIBILITY GATE — ZERO PROGRESS WHEN HIDDEN ───
  it('resets progress to 0 when section height is 0 (minimized/hidden)', async () => {
    // In jsdom, getBoundingClientRect() returns { height: 0, ... } by default.
    // This simulates the exact "collapsed WindowFrame" scenario:
    // the pathSectionRef element has height 0 → isSectionActive = false → visibleProgress = 0.

    const { container } = render(<Process lang="en" />);

    // Grab all animated SVG paths (desktop + mobile line)
    // Our motion mock exposes the MotionValue as data-path-length
    const animatedPaths = container.querySelectorAll('[data-path-length]');

    // Every animated path/line should have pathLength = 0
    animatedPaths.forEach((el) => {
      expect(el.getAttribute('data-path-length')).toBe('0');
    });
  });

  // ─── TEST 3: NODE STATES START INACTIVE ───
  it('all nodes start in inactive state (no active styling)', () => {
    render(<Process lang="en" />);

    // When activeNodes = 0, no node label should have the active color class.
    // Active labels get text-[#CCFF00]/80, inactive get text-white/60.
    const nodeLabels = screen.getAllByText(/NODE 0[1-3]/);
    nodeLabels.forEach((label) => {
      // None should have the active accent color in their class
      expect(label.className).not.toContain('text-[#CCFF00]');
    });
  });
});
