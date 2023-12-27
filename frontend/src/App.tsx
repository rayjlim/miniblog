import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from 'react-toastify';
// import { GoogleOAuthProvider } from '@react-oauth/google';

import DevRibbon from './components/DevRibbon';
import Search from './views/Search';
import OneDay from './views/OneDay';
import Media from './views/Media';
import Upload from './views/Upload';
import LoginPassword from './views/LoginPassword';
import Logs from './views/Logs';

import { SettingProvider } from './components/SettingContext';
import { AuthProvider } from './components/AuthContext';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
const SAMEDAY = 1;

const queryClient = new QueryClient();


const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingProvider>
          <StrictMode>
            <DevRibbon />
            <div id="app" className="App d-flex flex-column h-100">
            <ToastContainer autoClose={500} />
              <BrowserRouter>
                <Routes>
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/media" element={<Media />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/oneday" element={<OneDay />} />
                  <Route path="/oneday/:date" element={<OneDay />} />
                  <Route
                    path="/sameday"
                    element={<OneDay pageMode={SAMEDAY} />}
                  />
                  <Route
                    path="/sameday/:date"
                    element={<OneDay pageMode={SAMEDAY} />}
                  />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/login" element={<LoginPassword />} />
                  <Route path="*" element={<Navigate to="/oneday/" replace />} />
                </Routes>
              </BrowserRouter>
            </div>
          </StrictMode>
        </SettingProvider>
      </AuthProvider>
    </QueryClientProvider>

  );
};

export default App;
