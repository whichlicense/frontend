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

import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
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
import { v4 as uuidv4 } from "uuid";
import { useStatefulLinkedList } from "../components/Hooks/useStateFulLinkedList";
import { useProviderContext } from "../context/ProviderContext";
import {
  TPipelineStep,
  TPipelineTestOptions,
  TPipelineTestResultsOut,
  TPipelineTrace,
} from "../types/pipeline";
import { toastError } from "../components/utils/toasting";

enum EPipelineType {
  REMOVE = "remove",
  REPLACE = "replace",
  BATCH = "batch",
}
enum EPipelineUsing {
  TEXT = "text",
  REGEX = "pattern",
}

type TPipeLineShared = {
  id: string;
  ran: boolean;
  results?: TPipelineTrace;
};

type TPipeLine = TPipeLineShared &
  (
    | {
        type: EPipelineType.REMOVE;
        v: string;
        using: EPipelineUsing;
      }
    | {
        type: EPipelineType.REPLACE;
        using: EPipelineUsing;
        v: string;
        replaceWith: string;
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
      onClick() {
        setShowTestPipelineCard(true);
      },
    },
  ]);

  const { provider } = useProviderContext();

  const [showTestPipelineCard, setShowTestPipelineCard] = useState(false);
  const [testLicense, setTestLicense] = useState("");
  const [testAlgorithm, setTestAlgorithm] = useState("fuzzy");

  const [desiredConfidence, setDesiredConfidence] = useState(100);

  const [showAddPipeSegment, setShowAddPipeSegment] = useState(false);
  const [selectedPipeSegment, setSelectedPipeSegment] =
    useState<DoublyLinkedListNode<TPipeLine> | null>(null);
  const [addBefore, setAddBefore] = useState(true);

  const pipeline = useStatefulLinkedList<TPipeLine>(
    new DoublyLinkedList<TPipeLine>([])
  );
  const [selectedPipeline, setSelectedPipeline] =
    useState<DoublyLinkedList<TPipeLine>>(pipeline);

  const [pipelineTestResults, setPipelineTestResults] =
    useState<TPipelineTestResultsOut | null>(null);

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
                    setSelectedPipeline(pipeline);
                    setShowAddPipeSegment(true);
                    setAddBefore(true);
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

    const renderStepResultInformation = (item: TPipelineTrace | undefined) => {
      if (!item) return null;

      const topLicense = Object.entries(item.matches).sort(
        ([, confidence1], [, confidence2]) => confidence2 - confidence1
      )[0];
      return (
        <Stack>
          <hr />
          <p>
            {Object.keys(item.matches).length > 0 ? (
              <>
                Segment top license:{" "}
                <span className="bg-grey rounded txt-white px-2">
                  {topLicense[0]}
                </span>{" "}
                with a confidence of{" "}
                <span className="bg-grey rounded txt-white px-2">
                  {topLicense[1]}%
                </span>
              </>
            ) : (
              "No license detected"
            )}
          </p>
        </Stack>
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
                  onIconClick={() => {
                    pipeline.remove(pipeline_entry);
                    window.dispatchEvent(new Event("ll-update"));
                  }}
                >
                  <Stack>
                    <Row xs={1} md={2}>
                      <Col>
                        <Form.Select
                          onChange={(e) => {
                            console.log(e.target.value);
                            (pipeline_entry.value as any).using = e.target
                              .value as EPipelineUsing;
                            window.dispatchEvent(new Event("ll-update"));
                          }}
                          className="bg-dark-1 txt-white"
                        >
                          <option value={EPipelineUsing.REGEX}>
                            Using Regex
                          </option>
                          <option value={EPipelineUsing.TEXT}>
                            Using Text
                          </option>
                        </Form.Select>
                      </Col>
                      <Col>
                        <Form.Control
                          className="bg-dark-1 txt-white"
                          placeholder={`Enter ${
                            pipeline_entry.value.using === EPipelineUsing.REGEX
                              ? "regex"
                              : "text"
                          } here`}
                          value={pipeline_entry.value.v}
                          onChange={(e) => {
                            (pipeline_entry.value as any).v = e.target.value;
                            window.dispatchEvent(new Event("ll-update"));
                          }}
                        />
                      </Col>
                    </Row>
                    {renderStepResultInformation(pipeline_entry.value.results)}
                  </Stack>
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
                  onIconClick={() => {
                    pipeline.remove(pipeline_entry);
                    window.dispatchEvent(new Event("ll-update"));
                  }}
                >
                  <Stack>
                    <Row xs={1} md={3}>
                      <Col>
                        <Form.Select
                          onChange={(e) => {
                            console.log(e.target.value);
                            (pipeline_entry.value as any).using = e.target
                              .value as EPipelineUsing;
                            window.dispatchEvent(new Event("ll-update"));
                          }}
                          className="bg-dark-1 txt-white"
                        >
                          <option value={EPipelineUsing.REGEX}>
                            Using Regex
                          </option>
                          <option value={EPipelineUsing.TEXT}>
                            Using Text
                          </option>
                        </Form.Select>
                      </Col>
                      <Col>
                        <Form.Control
                          className="bg-dark-1 txt-white"
                          placeholder={`Enter ${
                            pipeline_entry.value.using === EPipelineUsing.REGEX
                              ? "regex"
                              : "text"
                          } here`}
                          value={pipeline_entry.value.v}
                          onChange={(e) => {
                            (pipeline_entry.value as any).v = e.target.value;
                            window.dispatchEvent(new Event("ll-update"));
                          }}
                        />
                      </Col>

                      <Col>
                        <Form.Control
                          className="bg-dark-1 txt-white"
                          placeholder="Your replacement text here"
                          defaultValue={pipeline_entry.value.replaceWith}
                          onChange={(e) => {
                            (pipeline_entry.value as any).replaceWith =
                              e.target.value;
                          }}
                        />
                      </Col>
                    </Row>
                    {renderStepResultInformation(pipeline_entry.value.results)}
                  </Stack>
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
                  onIconClick={() => {
                    pipeline.remove(pipeline_entry);
                    window.dispatchEvent(new Event("ll-update"));
                  }}
                >
                  <Stack>
                    <ArcherContainer>
                      <div>
                        <Row className="g-5">
                          {pipeline_entry.value.nested_pipeline.map(
                            (nested_entry) =>
                              renderPipeLine(
                                nested_entry,
                                {
                                  ...opts,
                                  bg: "bg-dark-2",
                                },
                                [
                                  {
                                    targetId: "",
                                    sourceAnchor: "bottom", // from this element's X
                                    targetAnchor: "top", // to the other element's X
                                    style: {
                                      strokeColor: "color(--color-grey)",
                                      strokeDasharray: "0",
                                    },
                                  },
                                ]
                              )
                          )}

                          <Col xs={12}>
                            <div className="position-relative">
                              <div className="position-absolute start-50 translate-middle">
                                <Button
                                  className="rounded-5"
                                  onClick={() => {
                                    setSelectedPipeSegment(
                                      (
                                        pipeline_entry.value as any
                                      ).nested_pipeline.getTail()
                                    );
                                    setSelectedPipeline(
                                      (pipeline_entry.value as any)
                                        .nested_pipeline
                                    );
                                    setShowAddPipeSegment(true);
                                    setAddBefore(false);
                                  }}
                                >
                                  <i className="bi bi-plus-circle-fill txt-blue"></i>
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </ArcherContainer>
                    {renderStepResultInformation(pipeline_entry.value.results)}
                  </Stack>
                </RegularCard>
              </div>
            </ArcherElement>
          </Col>
        );
      }
    }
  };

  const addToPipeline = (
    pipeline: DoublyLinkedList<TPipeLine>,
    current: DoublyLinkedListNode<TPipeLine> | null,
    toAdd: TPipeLine,
    addBefore: boolean
  ) => {
    if (pipeline.getSize() === 0) {
      pipeline.add(toAdd);
      return;
    }

    if (pipeline.getHead() === current!) {
      if (addBefore) {
        pipeline.insertBefore(pipeline.getHead()!, toAdd);
      } else {
        pipeline.insertAfter(pipeline.getHead()!, toAdd);
      }
    } else {
      if (addBefore) {
        pipeline.insertBefore(current!, toAdd);
      } else {
        pipeline.insertAfter(current!, toAdd);
      }
    }

    window.dispatchEvent(new Event("ll-update"));
  };

  const mapPipelineToRequest = (
    p: DoublyLinkedList<TPipeLine>
  ): TPipelineStep[] => {
    const pipelineItems: TPipelineStep[] = p
      .map(({ value }) => {
        switch (value.type) {
          case EPipelineType.REPLACE: {
            return {
              operation: value.type,
              parameters: {
                [value.using]: value.v,
                replacement: value.replaceWith,
              },
            };
          }
          case EPipelineType.REMOVE: {
            return {
              operation: value.type,
              parameters: {
                [value.using]: value.v,
              },
            };
          }

          case EPipelineType.BATCH: {
            return {
              operation: value.type,
              parameters: {
                steps: mapPipelineToRequest(value.nested_pipeline),
              },
            };
          }
          default: {
            toastError("Unknown pipeline type", "");
            return null;
          }
        }
      })
      .filter((v) => v !== null) as TPipelineStep[];

    return pipelineItems;
  };

  const testPipeLine = (opts: TPipelineTestOptions) => {
    provider.testPipeline(opts).then((res) => {
      setPipelineTestResults(res);

      // go over each result step and set the "ran" flag on the pipeline entry to true if ran
      pipeline.forEach((e, idx) => {
        idx += 1; // since the first element is always the initial run, which is not in our pipeline steps, we skip it
        if (res.traces[idx] && res.traces[idx].terminated) {
          e.value.ran = true;
          e.value.results = res.traces[idx];
        }
      });

      window.dispatchEvent(new Event("ll-update"));

      return res;
    });
  };

  const topMatch = (v: Record<string, number>) => {
    return Object.entries(v).reduce(
      (acc, [k, v]) => {
        if (v > acc[1]) {
          return [k, v];
        }

        return acc;
      },
      ["", 0]
    );
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
                  strokeColor: pipeline.getHead()?.value.ran
                    ? "var(--color-green)"
                    : "var(--color-red)",
                  strokeDasharray: pipeline.getHead()?.value.ran ? "0" : "5,5",
                },
              },
            ]}
          >
            <div>
              <RegularCard bg="bg-dark" minHeight="100%" maxHeight="100%">
                <>
                  <Stack>
                    <Row>
                      <Col md={"auto"}>
                        <Form.Label>
                          Desired confidence ({desiredConfidence.toFixed(1)}%)
                        </Form.Label>
                      </Col>
                      <Col>
                        <Form.Range
                          defaultValue={desiredConfidence}
                          min={0}
                          max={100}
                          step={0.5}
                          onChange={(e) => {
                            setDesiredConfidence(parseFloat(e.target.value));
                          }}
                        />
                      </Col>
                    </Row>

                    {pipelineTestResults && (
                      <Stack>
                        <hr />
                        <p>
                          Pipeline ran using{" "}
                          <span className="bg-grey rounded txt-white px-2">
                            {pipelineTestResults.algorithm}
                          </span>{" "}
                          algorithm
                        </p>
                        <p
                          className={
                            pipelineTestResults.traces.length > 0 &&
                            Object.keys(pipelineTestResults.traces[0].matches)
                              .length > 0
                              ? "txt-green"
                              : "txt-red"
                          }
                        >
                          {" "}
                          {pipelineTestResults.traces.length > 0 &&
                          Object.keys(pipelineTestResults.traces[0].matches)
                            .length > 0 ? (
                            <>
                              Resulting top license:{" "}
                              <span className="bg-grey rounded txt-white px-2">
                                {
                                  topMatch(
                                    pipelineTestResults.traces[pipelineTestResults.traces.length-1].matches
                                  )[0]
                                }
                              </span>{" "}
                              with a confidence of{" "}
                              <span className="bg-grey rounded txt-white px-2">
                                {
                                  topMatch(
                                    pipelineTestResults.traces[pipelineTestResults.traces.length-1].matches
                                  )[1]
                                }
                                %
                              </span>
                            </>
                          ) : (
                            "No license detected"
                          )}
                        </p>
                      </Stack>
                    )}
                  </Stack>
                </>
              </RegularCard>
            </div>
          </ArcherElement>

          <Row className="g-5">
            {pipeline.map((entry, idx) => renderPipeLine(entry))}

            <Col xs={12}>
              <div className="position-relative">
                <div className="position-absolute start-50 translate-middle">
                  <Button
                    className="rounded-5"
                    onClick={() => {
                      setSelectedPipeSegment(pipeline.getTail());
                      setSelectedPipeline(pipeline);
                      setShowAddPipeSegment(true);
                      setAddBefore(false);
                    }}
                  >
                    <i className="bi bi-plus-circle-fill txt-blue"></i>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Stack>
      </ArcherContainer>

      <InlineCard
        show={showTestPipelineCard}
        handleClose={() => setShowTestPipelineCard(false)}
      >
        <Stack direction="vertical">
          <textarea
            value={testLicense}
            className="w-100 bg-dark-1 txt-white rounded"
            rows={10}
            onChange={(e) => {
              setTestLicense(e.target.value);
            }}
            placeholder="Your license text goes here"
          ></textarea>
          <br />
          <Stack direction="horizontal" gap={3}>
            <Form.Select
              onChange={(e) => {
                setTestAlgorithm(e.target.value);
              }}
              defaultValue={testAlgorithm}
              className="w-50 bg-dark-1 txt-white"
            >
              <option value="fuzzy">Fuzzy detection algorithm</option>
              <option value="gaoya">Gaoya detection algorithm</option>
            </Form.Select>

            <Button
              className="bg-blue"
              onClick={() => {
                console.log("testPipeline", testAlgorithm, testLicense);
                testPipeLine({
                  algorithm: testAlgorithm,
                  license: testLicense,
                  pipeline: {
                    threshold: desiredConfidence,
                    name: "Test pipeline",
                    steps: mapPipelineToRequest(pipeline),
                  },
                });
                setShowTestPipelineCard(false);
              }}
            >
              Start test
            </Button>
            <Button
              className="bg-red txt-dark-1"
              onClick={() => setShowTestPipelineCard(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </InlineCard>

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
                    v: new RegExp(
                      /([\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})/
                    ).toString(),
                    using: EPipelineUsing.REGEX,
                  };

                  addToPipeline(
                    selectedPipeline,
                    selectedPipeSegment!,
                    toAdd,
                    addBefore
                  );
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

          <SectionHeading
            title={"Specific"}
            type="display"
            size={"5"}
            divider
          />
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
                    type: EPipelineType.REPLACE,
                    id: uuidv4(),
                    ran: false,
                    v: "",
                    replaceWith: "",
                    using: EPipelineUsing.TEXT,
                  };

                  addToPipeline(
                    selectedPipeline,
                    selectedPipeSegment!,
                    toAdd,
                    addBefore
                  );
                  setShowAddPipeSegment(false);
                }}
              >
                Replace instruction
              </RegularCard>
            </Col>

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
                    v: "",
                    using: EPipelineUsing.TEXT,
                  };

                  addToPipeline(
                    selectedPipeline,
                    selectedPipeSegment!,
                    toAdd,
                    addBefore
                  );
                  setShowAddPipeSegment(false);
                }}
              >
                Remove instruction
              </RegularCard>
            </Col>

            <Col>
              <RegularCard
                className="clickable"
                height="100px"
                overflowY="hidden"
                bg="bg-dark-2"
                onCardClick={() => {
                  const toAdd: TPipeLine = {
                    type: EPipelineType.BATCH,
                    id: uuidv4(),
                    ran: false,
                    nested_pipeline: new DoublyLinkedList<TPipeLine>(),
                  };

                  addToPipeline(
                    selectedPipeline,
                    selectedPipeSegment!,
                    toAdd,
                    addBefore
                  );
                  setShowAddPipeSegment(false);
                }}
              >
                Batch instruction
              </RegularCard>
            </Col>
          </Row>
        </>
      </InlineCard>
    </div>
  );
}
