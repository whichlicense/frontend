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

import { useState } from "react";
import { Form, Row, Col, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import { useToolBar } from "../components/Hooks/useToolBar";
import { InlineCard } from "../components/Modals/InlineCard";
import { ToolBarItemType } from "../context/ToolBarContext";
import { TDummyData } from "../types/dummy";
import { useEffectOnce } from "../components/utils/useEffectOnce";
import { useNavigate } from "react-router-dom";
import { useProviderContext } from "../context/ProviderContext";
import InfiniteScroll from "react-infinite-scroll-component";
import AddProjectCard from "../components/Modals/AddProject";
import { ETelemetryEntryType, Telemetry } from "../components/utils/Telemetry";
import { useSignal } from "../components/Hooks/useSignal";
import { ESignalType } from "../components/Provider/Provider";

export default function Search() {
  const [filterCardOpen, setFilterCardOpen] = useState(false);
  const navigate = useNavigate();
  const { provider } = useProviderContext();
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
      onClick: () => {
        setShowAddProject(true);
      },
    },
  ]);

  const [showAddProject, setShowAddProject] = useState(false);

  const [dummyData, setDummyData] = useState<
    TDummyData["transitiveDependencies"]
  >([]);
  const [slicedData, setSlicedData] = useState<
    TDummyData["transitiveDependencies"]
  >([]);

  const telemetry = Telemetry.instance;

  useSignal({
    signal: ESignalType.SCAN_FINISHED,
    callback: () => {
      updatePageData();
    },
  });

  useEffectOnce(() => {
    updatePageData();
  });

  const updatePageData = () => {
    provider.getAllScannedDependencies().then((data) => {
      setDummyData(data);
      setSlicedData(data.slice(0, 20));
    });
  };

  const fetchNextData = () => {
    setSlicedData([...dummyData.slice(0, slicedData.length + 20)]);
  };

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
      <InfiniteScroll
        dataLength={slicedData.length}
        next={fetchNextData}
        hasMore={slicedData.length < dummyData.length}
        loader={<></>} // TODO: Add a custom loader
        scrollableTarget="main-content-section"
        className="overflow-hidden"
        scrollThreshold={0.8}
      >
        <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-3">
          {slicedData.map((data, idx) => (
            <Col>
              <RegularCard
                height="250px"
                title={data.name}
                overflowY="scroll"
                icon="bi bi-arrow-up-right-circle"
                iconColor="txt-purple"
                onCardClick={() => {
                  navigate(`/scan-result/${data.name.replaceAll("/", "_")}`);
                }}
              >
                <Stack gap={1}>
                  <h6>Manager: {data.ecosystem}</h6>
                  <h6>
                    License: {data.license || "Unknown"}
                    <i className="bi bi-question-circle txt-red ms-2"></i>
                  </h6>
                  <h6>Latest: {data.version}</h6>
                  <small className="text-muted">Last scan: UNKNOWN</small>
                </Stack>
              </RegularCard>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>

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
            <Form.Select
              className="bg-grey border-0 txt-white"
              id="package-manager-selection"
            >
              <option value="1">All</option>
              <option value="2">NPM</option>
              <option value="3">Maven</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label htmlFor="license-selection">License</Form.Label>
            <Form.Select
              className="bg-grey border-0 txt-white"
              id="license-selection"
            >
              <option value="1">All</option>
              <option value="2">MIT</option>
              <option value="3">Apache 2.0</option>
            </Form.Select>
          </Col>
        </Row>
      </InlineCard>

      <AddProjectCard
        show={showAddProject}
        handleClose={() => {
          setShowAddProject(false);
          telemetry.addEntry({
            type: ETelemetryEntryType.INTERACTION,
            title: "Add project closed",
          });
        }}
      />
    </div>
  );
}
