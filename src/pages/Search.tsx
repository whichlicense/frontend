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

import { useEffect, useMemo, useState } from "react";
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
import Fuse from "fuse.js";

export default function Search() {
  const [filterCardOpen, setFilterCardOpen] = useState(false);
  const navigate = useNavigate();
  const { provider } = useProviderContext();
  useToolBar([
    {
      type: ToolBarItemType.INPUT,
      placeholder: "Search...",
      onChange: (value) => {
        setSearchInput(value);
      },
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

  // all the data
  const [originalData, setOriginalData] = useState<
    TDummyData["transitiveDependencies"]
  >([]);
  // data, but filtered by user request
  // const [filteredData, setFilteredData] = useState<
  // TDummyData["transitiveDependencies"]
  // >([]);
  // data slicing for infinite scroll
  const [slicedData, setSlicedData] = useState<
    TDummyData["transitiveDependencies"]
  >([]);


  const [searchInput, setSearchInput] = useState("");

  // fuzzy searching
  const fuseKeys = ['name', 'license', 'manager'];
  const [fuse, setFuse] = useState(new Fuse(originalData, {
    keys: fuseKeys
  }));

  // data, but filtered by user request
  const filteredData = useMemo(()=>{
    return searchInput.length > 0 ? fuse.search(searchInput).map(r => r.item) : originalData;
  }, [fuse, originalData, searchInput]);

  const telemetry = Telemetry.instance;

  useEffectOnce(() => {
    updatePageData();
  });
  useSignal({
    signal: ESignalType.SCAN_FINISHED,
    callback: () => {
      updatePageData();
    },
  });


  useEffect(() => {
    setSlicedData(filteredData.slice(0, 20));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData])

  const updatePageData = () => {
    provider.getAllScannedDependencies().then((data) => {
      setOriginalData(data);
      setFuse(new Fuse(data, {
        keys: fuseKeys
      }));
      setSlicedData(filteredData.slice(0, 20));
    });
  };

  const fetchNextData = () => {
    setSlicedData([...filteredData.slice(0, slicedData.length + 20)]);
  };

  return (
    <div>
      <br />
      <div>
        <h6 className="display-6">{originalData.length} Dependencies scanned</h6>
        <small className="text-muted">
          Enter some information about the dependency you want to search for.
          Use the toolbar above to fine tune your search parameters.
        </small>
      </div>
      <br />
      <InfiniteScroll
        dataLength={slicedData.length}
        next={fetchNextData}
        hasMore={slicedData.length < filteredData.length}
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
