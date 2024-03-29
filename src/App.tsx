/*
 *   Copyright (c) 2023 Duart Snel


 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import React, { useRef } from "react";
import "./App.css";
import "./styles/Animations.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Test } from "./pages/Test";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import NavigationBar from "./components/Navbar/Navbar";
import ScanResult from "./pages/ScanResult";
import { Container, Stack } from "react-bootstrap";
import ScrollIndicator from "./components/utils/ScrollIndicator";
import { DrawerContextProvider } from "./context/DrawerContext";
import ToolBarManager from "./components/Toolbar/ToolBarManager";
import { ToolBarContextProvider } from "./context/ToolBarContext";
import LicenseInfo from "./pages/LicenseInfo";
import Settings from "./pages/Settings";
import { ProviderContextProvider } from "./context/ProviderContext";
import Notifications from "./pages/Notifications";
import ExportView from "./pages/ExportView";
import Payment from "./pages/Payment";
import { Register } from "./pages/Register";
import { AuthContextProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import SubAccounts from "./pages/SubAccounts";

import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import useNavigationTelemetry from "./components/Hooks/useNavigationTelemetry";
import PipeLine from "./pages/PipeLine";
import ConfirmEmail from "./pages/ConfirmEmail";
import { LocaleContextProvider } from "./context/LocaleContext";
import Scans from "./pages/Scans";

function NavTelemetry() {
  useNavigationTelemetry();
  return null;
}
function App() {
  const mainContentRef = useRef(null);

  return (
    <Router>
      <NavTelemetry />
      <ProviderContextProvider>
        <LocaleContextProvider>
          <AuthContextProvider>
            <Container fluid className="h-100">
              <span
                style={{
                  backgroundImage: "url(assets/background.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top 40px left",
                  backgroundAttachment: "fixed",

                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",

                  position: "fixed",
                }}
              ></span>
              <DrawerContextProvider>
                <Stack
                  direction="horizontal"
                  className="d-flex align-items-center w-100 h-100"
                >
                  <NavigationBar />
                  <div className="flex-grow-1 flex-fill d-flex">
                    <Container fluid>
                      <ToolBarContextProvider>
                        <ToolBarManager />

                        <section
                          ref={mainContentRef}
                          className="clamp rounded px-4 pb-4 pt-5 overflow-auto shadow-fade-in"
                          id="main-content-section"
                        >
                          <Routes>
                            <Route path="/search" element={<Search />} />
                            <Route path="/scans" element={<Scans />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                              path="/scan-result/:id"
                              element={<ScanResult />}
                            />
                            <Route
                              path="/license/:id"
                              element={<LicenseInfo />}
                            />
                            <Route path="/pipeline" element={<PipeLine />} />
                            <Route
                              path="/notifications"
                              element={<Notifications />}
                            />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route
                              path="/export-view/:id"
                              element={<ExportView />}
                            />
                            <Route path="/test" element={<Test />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                              path="/sub-accounts"
                              element={<SubAccounts />}
                            />
                            <Route
                              path="/confirm-email/:token"
                              element={<ConfirmEmail />}
                            />
                            <Route path="/" element={<Home />} />
                          </Routes>
                          <ScrollIndicator bodyRef={mainContentRef} />
                        </section>
                      </ToolBarContextProvider>
                    </Container>
                  </div>
                </Stack>
              </DrawerContextProvider>
            </Container>
          </AuthContextProvider>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </LocaleContextProvider>
      </ProviderContextProvider>
    </Router>
  );
}

export default App;
