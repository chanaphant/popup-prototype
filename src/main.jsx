import { StrictMode } from 'react')
import ReactDOM from 'react-dom/client'
// Import ไฟล์ JSX ของคุณ (สมมติว่าคุณเปลี่ยนชื่อ popup0.013.jsx เป็น App.jsx เพื่อความง่าย)
import App from './App.jsx' 
// Import Tailwind CSS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)