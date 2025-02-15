import './App.css';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Home from './components/home/Home'

import Layout from './components/layout/Layout'

import { ColourSchemeProvider } from './components/layout/ColourSchemeContext'
import { LoadingProvider } from './components/layout/LoadingProvider'

function App() {

    return (
        <ColourSchemeProvider>
            <BrowserRouter>
                <LoadingProvider>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </Layout>
                </LoadingProvider>
            </BrowserRouter>
        </ColourSchemeProvider>
    );
}

export default App;
