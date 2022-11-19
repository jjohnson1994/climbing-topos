import { render, screen } from '@testing-library/react';
import RoutesAddToLogModal from './RoutesAddToLogModal';

const routes = [
  {
    title: 'Route One',
    slug: 'route_one',
    gradingSystem: 'Font'
  } 
]

it('Renders', () => {
  const onCancel = jest.fn()
  const onConfirm = jest.fn()
  const onRoutesLogged = jest.fn()

  render(
    <RoutesAddToLogModal
      // @ts-ignore next-line
      routes={routes} 
      visible={true} 
      onCancel={onCancel} 
      onConfirm={onConfirm} 
      onRoutesLogged={onRoutesLogged} 
    />
  );

  expect(screen.getByTestId('formSection-route_one')).toBeInTheDocument();
});
