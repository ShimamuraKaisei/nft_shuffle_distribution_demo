import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Demo1Page from './pages/Demo1Page';
import Demo2Page from './pages/Demo2Page';

export default function App() {
  useEffect(() => {
    document.body.style.margin = 'unset';
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Sans", "Noto Sans CJK JP", sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo1" element={<Demo1Page />} />
          <Route path="/demo2" element={<Demo2Page />} />
          {/* 新しいデモはここに追加 */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
