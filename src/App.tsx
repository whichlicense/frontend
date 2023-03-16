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
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import ScrollIndicator from "./components/utils/ScrollIndicator";
import { DrawerContextProvider } from "./context/DrawerContext";
import BackButton from "./components/Toolbar/BackButton";
import HelpButton from "./components/Toolbar/HelpButton";
import ToolBarManager from "./components/Toolbar/ToolBarManager";
import { ToolBarContextProvider } from "./context/ToolBarContext";
import LicenseInfo from "./pages/LicenseInfo";
import Settings from "./pages/Settings";
import { ProviderContextProvider } from "./context/ProviderContext";
import Notifications from "./pages/Notifications";
import ExportView from "./pages/ExportView";
import Payment from "./pages/Payment";

function App() {
  const mainContentRef = useRef(null);
  return (
    <Router>
      <Container fluid className="noise">
        <ProviderContextProvider>
          <DrawerContextProvider>
            <Stack
              direction="horizontal"
              className="d-flex align-items-center w-100"
              style={{ height: "100vh" }}
            >
              <NavigationBar />
              <div className="flex-grow-1 flex-fill d-flex">
                <Container fluid>
                  <ToolBarContextProvider>
                    <ToolBarManager />

                    <section
                      ref={mainContentRef}
                      className="clamp rounded px-4 pb-4 pt-5 overflow-auto shadow-fade-in"
                    >
                      <Routes>
                        <Route path="/search" element={<Search />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/scan-result/:id"
                          element={<ScanResult />}
                        />
                        <Route path="/license/:id" element={<LicenseInfo />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/export-view" element={<ExportView />} />
                        <Route path="/test" element={<Test />} />
                        <Route path="/" element={<Home />} />
                      </Routes>
                      <ScrollIndicator bodyRef={mainContentRef} />
                    </section>
                  </ToolBarContextProvider>
                </Container>
              </div>
            </Stack>
          </DrawerContextProvider>
        </ProviderContextProvider>
      </Container>
    </Router>
  );
}

export default App;
