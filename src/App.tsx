// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage' // これから作成するページコンポーネント

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
    </Routes>
  )
}

export default App