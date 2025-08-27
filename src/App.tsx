import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SceneSelector from './components/SceneSelector';
import ScenePreview from './components/ScenePreview';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<SceneSelector />} />
          <Route path="/:sceneId" element={<ScenePreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
