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

import { Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import SectionHeading from "../components/Typography/SectionHeading";

enum EPipelineType {
  REMOVE,
  REPLACE,
  BATCH,
}

type TPipeLine =
  | {
      type: EPipelineType.REMOVE;
    }
  | {
      type: EPipelineType.REPLACE;
    }
  | {
      type: EPipelineType.BATCH;
      value: TPipeLine[];
    };

export default function PipeLine() {
  const pipeline: TPipeLine[] = [
    {
      type: EPipelineType.REMOVE,
    },
    {
      type: EPipelineType.REMOVE,
    },
    {
      type: EPipelineType.REPLACE,
    },
    {
      type: EPipelineType.REMOVE,
    },
    {
      type: EPipelineType.BATCH,
      value: [
        {
          type: EPipelineType.REMOVE,
        },
        {
          type: EPipelineType.REMOVE,
        },
        {
          type: EPipelineType.REPLACE,
        },
        {
          type: EPipelineType.REMOVE,
        },
      ],
    },
  ];

  const renderPipeLine = (
    pipeline_entry: TPipeLine,
    opts = {
      xs: 12,
      md: 6,
      lg: 3,
    }
  ) => {
    switch (pipeline_entry.type) {
      case EPipelineType.REMOVE: {
        return (
          <Col xs={opts.xs} md={opts.md} lg={opts.lg}>
            <RegularCard
              title="Remove instruction"
              minHeight="100%"
              maxHeight="100%"
              icon="bi bi-x-circle-fill"
              iconClass="txt-red float-end"
            >
              <Stack gap={3}>
                  <Form.Select>
                    <option value="1">Using Regex</option>
                    <option value="2">Using Text</option>
                  </Form.Select>
                  <Form.Control placeholder="Your regex here" />
              </Stack>
            </RegularCard>
          </Col>
        );
      }
      case EPipelineType.REPLACE: {
        return (
          <Col xs={opts.xs} md={opts.md} lg={opts.lg}>
            <RegularCard
              title="Replace instruction"
              minHeight="100%"
              maxHeight="100%"
              icon="bi bi-x-circle-fill"
              iconClass="txt-red float-end"
            >
              <Stack gap={3}>
                <Form.Select>
                  <option value="1">Using Regex</option>
                  <option value="2">Using Text</option>
                </Form.Select>
                <Form.Control placeholder="Your regex here" />
                <Form.Control placeholder="Your replacement here" />
              </Stack>
            </RegularCard>
          </Col>
        );
      }
      case EPipelineType.BATCH: {
        return (
          <Col xs={12}>
            <RegularCard
              title="Batch instruction"
              minHeight="100%"
              maxHeight="100%"
              icon="bi bi-x-circle-fill"
              iconClass="txt-red float-end"
            >
              <Row>
                {pipeline_entry.value.map((nested_entry, idx) => (
                  <Col key={`nested-${idx}`}>
                    {renderPipeLine(nested_entry, {
                      xs: 12,
                      md: 12,
                      lg: 12,
                    })}
                  </Col>
                ))}
              </Row>
            </RegularCard>
          </Col>
        );
      }
    }
  };

  return (
    <div>
      <SectionHeading
        title={"Pipeline construction"}
        type="display"
        size={"4"}
      />
      <Stack gap={3} className="mb-3">
        <RegularCard minHeight="100%" maxHeight="100%">
          <>
            <Row>
              <Col md={"auto"}>
                <Form.Label>Confidence threshold</Form.Label>
              </Col>
              <Col>
                <Form.Range min={0} max={100} step={0.5} />
              </Col>
            </Row>
          </>
        </RegularCard>

        <Row className="g-5">
          {pipeline.map((entry) => renderPipeLine(entry))}
        </Row>
      </Stack>
    </div>
  );
}
