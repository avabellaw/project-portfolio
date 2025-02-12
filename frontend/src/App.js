import './App.css';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Home from './components/home/Home'

import Layout from './components/layout/Layout'

import { ColourSchemeProvider } from './components/layout/ColourSchemeContext'

function App() {

    return (
        <ColourSchemeProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ColourSchemeProvider>
    );
}

export default App;
