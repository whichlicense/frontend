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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Test } from "./pages/Test";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import NavigationBar from "./components/Navbar/Navbar";
import ScanResult from "./pages/ScanResult";
import { Col, Container, Row } from "react-bootstrap";
import ScrollIndicator from "./components/utils/ScrollIndicator";

function App() {
  const mainContentRef = useRef(null);
  return (
    <Router>
      <Container fluid>
        <Row className="d-flex align-items-center" style={{ height: "100vh" }}>
          <Col xs={2} className="pe-0">
            <NavigationBar />
          </Col>
          <Col xs={10} className="g-0">
            <Container fluid>
              <section ref={mainContentRef} className="clamp rounded-5 p-4 overflow-auto">
                <Routes>
                  <Route path="/search" element={<Search />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/scan-result" element={<ScanResult />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="/" element={<Home />} />
                </Routes>
                <ScrollIndicator bodyRef={mainContentRef} />
              </section>
            </Container>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
