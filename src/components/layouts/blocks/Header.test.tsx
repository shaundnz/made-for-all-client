import { screen } from '@testing-library/react';

import { renderWithContext } from '@/testing/renderUtils';

import { Header } from './Header';

describe('Header', () => {
  it('should render', () => {
    renderWithContext(<Header />);

    expect(screen.getByText('MadeForAll')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render the logo with a navigation link to the homepage', () => {
    renderWithContext(<Header />);

    const link = screen.getByRole('link', { name: 'MadeForAll' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have a navigation link to the home page', () => {
    renderWithContext(<Header />);

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
