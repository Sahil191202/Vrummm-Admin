import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/ui/empty-state';
import { ErrorState } from '../components/ui/error-state';
import { SplineAreaChart, DonutProgressCircle, ZoneProgressBar } from '../components/ui/chart';
import { AvatarStack } from '../components/ui/avatar-stack';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { tokens, colors, typography, contrastRatios } from '@vrumm/ui-tokens';

describe('Vrumm Design Tokens (@vrumm/ui-tokens)', () => {
  it('defines exact brand colors (Charcoal, Forest green, Crimson, Shine Accent)', () => {
    expect(colors.brand.charcoal).toBe('#171717');
    expect(colors.brand.forestGreen).toBe('#06110C');
    expect(colors.brand.crimson).toBe('#A31C18');
    expect(colors.brand.accentShine).toBe('#1FD88A');
    expect(colors.brand.crimsonTintDark).toBe('#FF5A52');
    expect(colors.dark.background).toBe('#06110C');
    expect(colors.dark.surface).toBe('#171717');
    expect(colors.dark.sidebar).toBe('#0B1A13');
  });

  it('defines fonts with Plus Jakarta Sans and Noto Sans Devanagari fallback', () => {
    expect(typography.fonts.sans).toContain('Plus Jakarta Sans');
    expect(typography.fonts.sans).toContain('Noto Sans Devanagari');
  });

  it('documents verified WCAG contrast ratios', () => {
    expect(contrastRatios.whiteOnCrimson).toContain('8.33:1');
    expect(contrastRatios.crimsonTintOnDark).toContain('6.30:1');
    expect(contrastRatios.forestGreenOnDark).toContain('11.20:1');
    expect(contrastRatios.primaryTextOnDark).toContain('16.50:1');
  });
});

describe('Shared UI Components (shadcn/ui restyle)', () => {
  it('renders Button with primary crimson styling and responds to clicks', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="default" onClick={handleClick}>
        Confirm Action
      </Button>,
    );

    const btn = screen.getByRole('button', { name: /Confirm Action/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('bg-[#A31C18]');
    expect(btn).toHaveClass('text-white');

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders Input with accessible error message and icon (never color alone)', () => {
    render(
      <Input
        label="Operator Email"
        error="Please provide a valid operator email"
      />,
    );

    expect(screen.getByText('Operator Email')).toBeInTheDocument();
    expect(screen.getByText('Please provide a valid operator email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders Card with title and content', () => {
    render(
      <Card glow>
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>Cluster is fully operational.</CardContent>
      </Card>,
    );

    expect(screen.getByText(/System Diagnostics/i)).toBeInTheDocument();
    expect(screen.getByText(/Cluster is fully operational/i)).toBeInTheDocument();
  });

  it('renders Badge with online dot indicator', () => {
    render(
      <Badge variant="forest" dot>
        Active Captains
      </Badge>,
    );

    expect(screen.getByText(/Active Captains/i)).toBeInTheDocument();
  });

  it('renders Charts, Radial Progress and Zone Progress Bars', () => {
    render(
      <div>
        <SplineAreaChart />
        <DonutProgressCircle percentage={85} label="Fleet Online" />
        <ZoneProgressBar zone="BKC" count={500} percentage={75} />
      </div>,
    );

    expect(screen.getByText(/Fleet Online/i)).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('BKC')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders AvatarStack and Table with Mumbai ride rows', () => {
    render(
      <div>
        <AvatarStack users={[{ name: 'Agent A', initials: 'AA' }]} extraCount={3} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>VRM-101</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>,
    );

    expect(screen.getByText('AA')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('VRM-101')).toBeInTheDocument();
  });

  it('renders EmptyState and ErrorState with icons and retry action', () => {
    const handleRetry = vi.fn();

    render(
      <>
        <EmptyState title="No Rides Found" description="Try broadening search filters" />
        <ErrorState
          title="Network Failure"
          message="Failed to fetch booking timeline"
          code="NETWORK_ERR"
          onRetry={handleRetry}
        />
      </>,
    );

    expect(screen.getByText(/No Rides Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Failure/i)).toBeInTheDocument();
    expect(screen.getByText(/NETWORK_ERR/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Operation/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
