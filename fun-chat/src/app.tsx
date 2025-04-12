import React from '@/react';
import { navigate, Router } from '@react/router';

const Home = (): React.JSX.Element => (
  <div>
    <p>Home</p>
    <button onClick={() => navigate('/about')}>About</button>
  </div>
);
const About = (): React.JSX.Element => (
  <div>
    <p>About</p>

    <button onClick={() => navigate('/')}>Home</button>
  </div>
);
const Exception404 = (): React.JSX.Element => (
  <div>
    <p>404</p>
    <button onClick={() => navigate('/')}>Home</button>
  </div>
);

const routes = [
  { path: '/', component: <Home /> },
  { path: '/about', component: <About /> },
];

export function App(): React.JSX.Element {
  const [show, setShow] = React.useState(true);
  return (
    <div>
      {show && (
        <div>
          <Router routes={routes} fallback={<Exception404 />} />
        </div>
      )}

      <button onClick={() => setShow((pre) => !pre)}>SHOW</button>
    </div>
  );
}
