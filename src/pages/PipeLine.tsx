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

import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import RegularCard from "../components/Cards/RegularCard";
import SectionHeading from "../components/Typography/SectionHeading";
import { ArcherContainer, ArcherElement } from "react-archer";
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from "../components/utils/LinkedList";
import { RelationType } from "react-archer/lib/types";
import { BgColors } from "../components/typings/Colors";
import { useToolBar } from "../components/Hooks/useToolBar";
import { ToolBarItemType } from "../context/ToolBarContext";
import { InlineCard } from "../components/Modals/InlineCard";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


enum EPipelineType {
  REMOVE,
  REPLACE,
  BATCH,
}

type TPipeLineShared = {
  id: string;
  ran: boolean;
};

type TPipeLine = TPipeLineShared &
  (
    | {
        type: EPipelineType.REMOVE;
        v: string;
      }
    | {
        type: EPipelineType.REPLACE;
      }
    | {
        type: EPipelineType.BATCH;
        nested_pipeline: DoublyLinkedList<TPipeLine>;
      }
  );

export default function PipeLine() {
  useToolBar([
    {
      type: ToolBarItemType.BUTTON,
      title: "Import",
      icon: "bi bi-box-arrow-in-down",
      onClick() {
        console.log("import");
      },
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Export",
      icon: "bi bi-box-arrow-up",
      onClick() {
        console.log("export");
      },
    },
    {
      type: ToolBarItemType.SEPARATOR,
    },
    {
      type: ToolBarItemType.BUTTON,
      title: "Test",
      icon: "bi bi-file-play",
      onClick() {},
    },
  ]);

  const [showAddPipeSegment, setShowAddPipeSegment] = useState(false);
  const [selectedPipeSegment, setSelectedPipeSegment] =
    useState<DoublyLinkedListNode<TPipeLine> | null>(null);
  const pipeline = new DoublyLinkedList<TPipeLine>([
    {
      id: "1",
      type: EPipelineType.REMOVE,
      ran: false,
      v: "/test/g"
    },
    {
      id: "2",
      type: EPipelineType.REMOVE,
      ran: false,
      v: "/test/g"
    },
    {
      id: "3",
      type: EPipelineType.REPLACE,
      ran: false,
    },
    {
      id: "4",
      type: EPipelineType.REMOVE,
      ran: false,
      v: "/test/g"
    },
    {
      id: "5",
      type: EPipelineType.BATCH,
      ran: false,
      nested_pipeline: new DoublyLinkedList<TPipeLine>([
        {
          id: "5.1",
          type: EPipelineType.REMOVE,
          ran: false,
          v: "/test/g"
        },
        {
          id: "5.2",
          type: EPipelineType.REMOVE,
          ran: false,
          v: "/test/g"
        },
        {
          id: "5.3",
          type: EPipelineType.REPLACE,
          ran: false,
        },
        {
          id: "5.4",
          type: EPipelineType.REMOVE,
          ran: false,
          v: "/test/g"
        },
      ]),
    },
    {
      id: "6",
      type: EPipelineType.REPLACE,
      ran: false,
    },
    {
      id: "7",
      type: EPipelineType.REMOVE,
      ran: false,
      v: "/test/g"
    },
  ]);

  const arrowRelationship = (
    current_item: DoublyLinkedListNode<TPipeLine>,
    override?: RelationType[]
  ): RelationType[] => {
    const sourceAnchor = "bottom";
    const targetAnchor = "top";
    return override
      ? override
      : [
          {
            targetId: current_item.next?.value.id ?? "",
            sourceAnchor, // from this element's X
            targetAnchor, // to the other element's X
            style: {
              strokeColor: current_item.value.ran
                ? "color(--color-green)"
                : "var(--color-red)",
              strokeDasharray: current_item.value.ran ? "0" : "5,5",
            },
          },
        ];
  };

  const renderPipeLine = (
    pipeline_entry: DoublyLinkedListNode<TPipeLine>,
    opts = {
      xs: 12,
      md: 12,
      lg: 12,
      bg: "bg-dark" as BgColors,
    },
    override_arrow_relations?: RelationType[]
  ) => {
    const wrapAddButtons = (children: JSX.Element) => {
      return (
        <>
          <Col xs={12}>
            <div className="position-relative">
              <div className="position-absolute start-50 translate-middle">
                <Button
                  className="rounded-5"
                  onClick={() => {
                    setSelectedPipeSegment(pipeline_entry);
                    setShowAddPipeSegment(true);
                  }}
                >
                  <i className="bi bi-plus-circle-fill txt-blue"></i>
                </Button>
              </div>
            </div>
          </Col>

          {children}
        </>
      );
    };

    switch (pipeline_entry.value.type) {
      case EPipelineType.REMOVE: {
        return wrapAddButtons(
          <Col xs={opts.xs} md={opts.md} lg={opts.lg}>
            <ArcherElement
              id={pipeline_entry.value.id}
              relations={arrowRelationship(
                pipeline_entry,
                override_arrow_relations
              )}
            >
              <div>
                <RegularCard
                  title="Remove instruction"
                  minHeight="100%"
                  maxHeight="100%"
                  icon="bi bi-x-circle-fill"
                  iconClass="txt-red float-end"
                  bg={opts.bg}
                >
                  <Row xs={1} md={2}>
                    <Col>
                      <Form.Select className="bg-dark-1 txt-white">
                        <option value="1">Using Regex</option>
                        <option value="2">Using Text</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Control
                        className="bg-dark-1 txt-white"
                        placeholder="Your regex here"
                      />
                    </Col>
                  </Row>
                </RegularCard>
              </div>
            </ArcherElement>
          </Col>
        );
      }
      case EPipelineType.REPLACE: {
        return wrapAddButtons(
          <Col xs={opts.xs} md={opts.md} lg={opts.lg}>
            <ArcherElement
              id={pipeline_entry.value.id}
              relations={arrowRelationship(
                pipeline_entry,
                override_arrow_relations
              )}
            >
              <div>
                <RegularCard
                  title="Replace instruction"
                  minHeight="100%"
                  maxHeight="100%"
                  icon="bi bi-x-circle-fill"
                  iconClass="txt-red float-end"
                  bg={opts.bg}
                >
                  <Row xs={1} md={3}>
                    <Col>
                      <Form.Select className="bg-dark-1 txt-white">
                        <option value="1">Using Regex</option>
                        <option value="2">Using Text</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Control
                        className="bg-dark-1 txt-white"
                        placeholder="Your regex here"
                      />
                    </Col>

                    <Col>
                      <Form.Control
                        className="bg-dark-1 txt-white"
                        placeholder="Your replacement here"
                      />
                    </Col>
                  </Row>
                </RegularCard>
              </div>
            </ArcherElement>
          </Col>
        );
      }
      case EPipelineType.BATCH: {
        return wrapAddButtons(
          <Col xs={12}>
            <ArcherElement
              id={pipeline_entry.value.id}
              relations={arrowRelationship(
                pipeline_entry,
                override_arrow_relations
              )}
            >
              <div>
                <RegularCard
                  title="Batch instruction"
                  minHeight="100%"
                  maxHeight="100%"
                  icon="bi bi-x-circle-fill"
                  iconClass="txt-red float-end"
                  bg={opts.bg}
                >
                  <ArcherContainer>
                    <div>
                      <Row className="g-5">
                        {pipeline_entry.value.nested_pipeline.map(
                          (nested_entry) =>
                            renderPipeLine(nested_entry, {
                              ...opts,
                              bg: "bg-dark-2",
                            })
                        )}
                      </Row>
                    </div>
                  </ArcherContainer>
                </RegularCard>
              </div>
            </ArcherElement>
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
      {/* TODO: change these based on if the thing ran or not */}
      <ArcherContainer>
        <Stack gap={5} className="mb-3">
          <ArcherElement
            id="root"
            relations={[
              {
                targetId: pipeline.getHead()?.value.id || "root",
                targetAnchor: "top",
                sourceAnchor: "bottom",
                style: {
                  strokeColor: "var(--color-red)",
                  strokeDasharray: pipeline.getHead()?.value.ran ? "0" : "5,5",
                },
              },
            ]}
          >
            <div>
              <RegularCard bg="bg-dark" minHeight="100%" maxHeight="100%">
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
            </div>
          </ArcherElement>

          <Row className="g-5">
            {pipeline.map((entry) => renderPipeLine(entry))}
          </Row>
        </Stack>
      </ArcherContainer>

      <InlineCard
        show={showAddPipeSegment}
        handleClose={() => setShowAddPipeSegment(false)}
      >
        <>
          <SectionHeading title={"Presets"} type="display" size={"5"} />
          <br />
          <Row xs={1} md={3} lg={4}>
            <Col>
              <RegularCard
                className="clickable"
                height="100px"
                overflowY="hidden"
                bg="bg-dark-2"
                onCardClick={() => {
                  const toAdd: TPipeLine = {
                    type: EPipelineType.REMOVE,
                    id: uuidv4(),
                    ran: false,
                    v: new RegExp(/([\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})/).toString()
                  };
                  if (pipeline.getHead() === null) {
                    pipeline.add(toAdd);
                  } else {
                    pipeline.insertAfter(
                      selectedPipeSegment?.prev || pipeline.getHead()!,
                      toAdd
                    );
                  }

                  setShowAddPipeSegment(false);
                }}
              >
                Remove phone numbers
              </RegularCard>
            </Col>

            <Col>
              <RegularCard
                className="clickable"
                height="100px"
                overflowY="hidden"
                bg="bg-dark-2"
                onCardClick={() => {}}
              >
                Remove Copyright heading
              </RegularCard>
            </Col>

            <Col>
              <RegularCard
                className="clickable"
                height="100px"
                overflowY="hidden"
                bg="bg-dark-2"
                onCardClick={() => {}}
              >
                Replace all tabs with spaces
              </RegularCard>
            </Col>

            <Col>
              <RegularCard
                className="clickable"
                height="100px"
                overflowY="hidden"
                bg="bg-dark-2"
                onCardClick={() => {}}
              >
                Lowercase all characters
              </RegularCard>
            </Col>
          </Row>

          <SectionHeading title={"Manual"} type="display" size={"5"} divider />
          <br />
          <Row xs={1} md={2} lg={3}>
            <Col>
              <Form.Select className="bg-dark-2 txt-white">
                <option value="1">Regex remove</option>
                <option value="2">Regex replace</option>
                <option value="3">Text remove</option>
                <option value="3">Text replace</option>
              </Form.Select>
            </Col>

            <Col>
              <Form.Control
                className="bg-dark-2 txt-white"
                placeholder="Your regex here"
              />
            </Col>
          </Row>
        </>
      </InlineCard>
    </div>
  );
}
