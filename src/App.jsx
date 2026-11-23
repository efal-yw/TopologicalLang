import P5Canvas from './P5Canvas.jsx';
import { sketch } from './sketch.js';

export default function App() {
  return <P5Canvas sketch={sketch} />;
}
