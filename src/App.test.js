import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the daily orb home page', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /daily orb reflections/i })
  ).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /today/i })).toHaveLength(2);
  expect(screen.getByRole('link', { name: /quiet room/i })).toHaveAttribute(
    'href',
    '/quiet-room'
  );
});
