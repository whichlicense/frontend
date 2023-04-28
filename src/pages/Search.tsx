/*
 *   Copyright (c) 2023 Duart Snel
 *   All rights reserved.

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

import { useEffect, useState } from "react";
import { InputGroup, Form, Row, Col, Stack, ListGroup } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import { ToolBarItemType } from "../context/ToolBarContext";
import { TDummyData } from "../types/dummy";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "../CONFIG";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [depCardOpen, setDepCardOpen] = useState(false);
  const [filterCardOpen, setFilterCardOpen] = useState(false);
  const navigate = useNavigate();
  useToolBar([
    {
      type: ToolBarItemType.INPUT,
      placeholder: "Search...",
      onChange: (value) => {},
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Filter",
      icon: "bi bi-filter",
      onClick: () => {
        setFilterCardOpen(true);
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "New scan",
      icon: "bi bi-plus",
      onClick: () => {},
    },
  ]);

  const [dummyData, setDummyData] = useState<TDummyData["transitiveDependencies"]>([])

  useEffectOnce(()=>{
    axios.get(`${CONFIG.gateway_url}/scan/get-scans`, {}).then((res)=>{
      setDummyData(res.data)
    }).catch((err)=>{
      console.log(err)
      toast.error(err.data.error || "Something went wrong")
    })
  })
  return (
    <div>
      <br />
      <div>
        <h6 className="display-6">{dummyData.length} Dependencies scanned</h6>
        <small className="text-muted">
          Enter some information about the dependency you want to search for.
          Use the toolbar above to fine tune your search parameters.
        </small>
      </div>
      <br />
      <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-3">
        {dummyData.map((data, idx) => (
          <Col>
            <RegularCard
              height="250px"
              title={data.name}
              overflowY="scroll"
              icon="bi bi-arrow-up-right-circle"
              iconColor="txt-purple"
              onCardClick={()=>{
                navigate(`/scan-result/${data.name.replaceAll("/", "_")}`)
              }}
            >
              <Stack gap={1}>
                <h6>Manager: {data.ecosystem}</h6>
                <h6>License: {data.license || "Unknown"}
                  <i className="bi bi-question-circle txt-red ms-2"></i>
                </h6>
                <h6>Latest: {data.version}</h6>
                <small className="text-muted">Last scan: UNKNOWN</small>
              </Stack>
            </RegularCard>
          </Col>
        ))}
      </Row>

      <InlineCard
        title="Filter"
        show={filterCardOpen}
        handleClose={() => setFilterCardOpen(false)}
      >
        <Row>
          <Col>
            <Form.Label htmlFor="package-manager-selection">
              Package manager
            </Form.Label>
            <Form.Select className="bg-grey border-0 txt-white" id="package-manager-selection">
              <option value="1">All</option>
              <option value="2">NPM</option>
              <option value="3">Maven</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label htmlFor="license-selection">License</Form.Label>
            <Form.Select className="bg-grey border-0 txt-white" id="license-selection">
              <option value="1">All</option>
              <option value="2">MIT</option>
              <option value="3">Apache 2.0</option>
            </Form.Select>
          </Col>
          
        </Row>
      </InlineCard>
    </div>
  );
}
