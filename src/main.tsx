import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PrimeReactProvider } from 'primereact/api';

// 1. Tailwind & Base Styles (Loaded first so PrimeReact can override its resets)
import './styles/index.css'

// 2. PrimeReact Core & Theme (Loaded after Tailwind base to ensure skins work)
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// 3. PrimeFlex (Loaded LAST to ensure its .grid and layout classes win over Tailwind collisions)
import "primeflex/primeflex.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>,
)
