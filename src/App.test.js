import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the three.js components since they don't work in Jest
jest.mock('./ThreeDViewer', () => () => <div data-testid="three-d-viewer">3D Viewer</div>);
jest.mock('./InteractiveCubeBackground', () => () => <div data-testid="interactive-background">Background</div>);

test('renders 3D Design Generator heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/3D Design Generator/i);
  expect(headingElement).toBeInTheDocument();
});
