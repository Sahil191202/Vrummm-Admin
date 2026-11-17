import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  CountUp,
  SpotlightCard,
  ShinyText,
  DecryptedText,
  OrbitalLoader,
  ShimmerSkeleton,
  BorderBeam,
  GlowInput,
} from './index';

describe('React Bits Component Suite (/unslop)', () => {
  describe('CountUp', () => {
    it('renders initial value and prefix correctly', () => {
      render(<CountUp from={0} to={100} prefix="₹" />);
      expect(screen.getByText(/₹/)).toBeInTheDocument();
    });

    it('formats numbers with thousand separators', () => {
      render(<CountUp from={1500} to={1500} separator="," />);
      expect(screen.getByText('1,500')).toBeInTheDocument();
    });
  });

  describe('SpotlightCard', () => {
    it('renders children with spotlight overlay container', () => {
      render(
        <SpotlightCard variant="emerald">
          <p>Card Content</p>
        </SpotlightCard>
      );
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('tracks mouse movement to illuminate spotlight', () => {
      const { container } = render(
        <SpotlightCard variant="crimson">
          <p>Hover Me</p>
        </SpotlightCard>
      );
      const card = container.firstChild;
      fireEvent.mouseEnter(card);
      fireEvent.mouseMove(card, { clientX: 100, clientY: 120 });
      expect(card).toBeInTheDocument();
      fireEvent.mouseLeave(card);
    });
  });

  describe('ShinyText', () => {
    it('renders text with gradient sheen background styling', () => {
      render(<ShinyText>Live Cluster</ShinyText>);
      const element = screen.getByText('Live Cluster');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('bg-clip-text');
    });

    it('falls back to plain text when disabled', () => {
      render(<ShinyText disabled>Plain Text</ShinyText>);
      const element = screen.getByText('Plain Text');
      expect(element).toBeInTheDocument();
      expect(element).not.toHaveClass('bg-clip-text');
    });
  });

  describe('DecryptedText', () => {
    it('eventually reveals the target decrypted text', async () => {
      vi.useFakeTimers();
      render(<DecryptedText text="VRM-9821" maxIterations={2} speed={10} animateOn="mount" />);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.getByText('VRM-9821')).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe('OrbitalLoader', () => {
    it('renders dual counter-rotating SVG rings and accessible status label', () => {
      render(<OrbitalLoader label="Dispatching Offer..." size="md" />);
      expect(screen.getByRole('status', { name: 'Dispatching Offer...' })).toBeInTheDocument();
      expect(screen.getByText('Dispatching Offer...')).toBeInTheDocument();
    });
  });

  describe('ShimmerSkeleton', () => {
    it('renders skeleton element with directional shimmer sweep gradient', () => {
      const { container } = render(<ShimmerSkeleton className="h-6 w-32" />);
      expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('BorderBeam', () => {
    it('renders perimeter border beam container', () => {
      const { container } = render(<BorderBeam size={100} duration={5} />);
      expect(container.firstChild).toHaveClass('pointer-events-none');
    });
  });

  describe('GlowInput', () => {
    it('renders input with label, shortcut, and clear button', () => {
      const handleChange = vi.fn();
      render(
        <GlowInput
          label="Cluster Search"
          value="Bandra"
          onChange={handleChange}
          shortcut="⌘K"
          clearable
        />
      );
      expect(screen.getByLabelText('Cluster Search')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    it('displays error message and alert icon on validation error', () => {
      render(<GlowInput label="Pickup" error="Invalid landmark" />);
      expect(screen.getByText('Invalid landmark')).toBeInTheDocument();
    });
  });
});
