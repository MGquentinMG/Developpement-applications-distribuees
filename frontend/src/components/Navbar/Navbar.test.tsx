import { render } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest'; 
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Composant Navbar', () => {
  it('doit appliquer le style actif (rond blanc) sur le lien Accueil (/)', () => {
    
    (usePathname as Mock).mockReturnValue('/');

    const { container } = render(<Navbar />);
    const homeLink = container.querySelector('a[href="/"]');
    
    expect(homeLink?.className).toContain('bg-white/40');
    
    const messagesLink = container.querySelector('a[href="/messages"]');
    expect(messagesLink?.className).not.toContain('bg-white/40');
  });

  it('doit changer le style actif si on est sur la page Messages', () => {
    
    (usePathname as Mock).mockReturnValue('/messages');

    const { container } = render(<Navbar />);

    const messagesLink = container.querySelector('a[href="/messages"]');
    const homeLink = container.querySelector('a[href="/"]');

    expect(messagesLink?.className).toContain('bg-white/40');
    expect(homeLink?.className).not.toContain('bg-white/40');
  });
});