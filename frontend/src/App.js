import './App.css';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Home from './components/home/Home'

import Layout from './components/layout/Layout'

import { ColourSchemeProvider } from './components/ColourSchemeContext'
import { LoadingProvider } from './components/LoadingContext'
import { ViewportSizeProvider } from './components/ViewportSizeContext'

function App() {

    return (
        <ColourSchemeProvider>
            <BrowserRouter>
                <LoadingProvider>
                    <ViewportSizeProvider>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="*" Component={() => <Navigate to="/" />} />
                            </Routes>
                        </Layout>
                    </ViewportSizeProvider>
                </LoadingProvider>
            </BrowserRouter>
        </ColourSchemeProvider>
    );
}

export default App;
