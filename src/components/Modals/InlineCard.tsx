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

import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import '../../styles/Modal.css'

type InlineCardProps = {
  show: boolean
  placement?: 'start' | 'end' | 'top' | 'bottom'
  handleClose?: () => void
  title?: string
  children: JSX.Element | void
  className?: string
  style?: CSSProperties
  maxHeight?: string
  minHeight?: string
}
export function InlineCard(props: InlineCardProps) {
  const [cardPos, setCardPos] = useState<CSSProperties>({
    transform: undefined,
    transition: undefined,
  })
  const cardRef = useRef<any>()

  const [initialPos, setInitialPos] = useState(0)
  const [closeOnEnd, setCloseOnEnd] = useState(false)

  const handleClose = () => {
    if (props.handleClose) props.handleClose()
  }

  useEffect(() => {
    const docRoot = document.body
    if (props.show) {
      docRoot?.classList.remove('inline_card_closed')
      docRoot?.classList.add('inline_card_open')
    } else {
      docRoot?.classList.remove('inline_card_open')
      docRoot?.classList.add('inline_card_closed')
    }
  }, [props.show])

  const onCardDrag = (e: TouchEvent) => {
    if (!e.changedTouches.item(0)) return
    const perc =
      (cardRef!.current!.dialog as HTMLElement).getBoundingClientRect().height -
      (window.innerHeight - e.changedTouches.item(0)!.clientY)

    if (perc - initialPos > 150) {
      setCloseOnEnd(true)
    } else {
      setCloseOnEnd(false)
    }
    setCardPos({
      transform: `translateY(${perc}px)`,
      transition: 'none',
    })
    return false
  }

  const onCardDragStart = (e: TouchEvent) => {
    setInitialPos(
      (cardRef!.current!.dialog as HTMLElement).getBoundingClientRect().height -
        (window.innerHeight - e.changedTouches.item(0)!.clientY)
    )
  }

  const onCardDragEnd = (e: TouchEvent) => {
    setCardPos({
      transform: undefined,
      transition: undefined,
    })


    if (closeOnEnd) {
      handleClose()
      setCloseOnEnd(false)
      setInitialPos(0)
    }
  }

  return (
    <>
      <Offcanvas
        show={props.show}
        onHide={handleClose}
        placement={props.placement || 'bottom'}
        className={`rounded px-3 pb-2 pt-1   shadow section ${
          props.className ? props.className : ''
        }`}
        style={{
          height: 'unset',
          maxHeight: props.maxHeight || '85%',
          minHeight: props.minHeight || '85%',
          ...(props.style ? props.style : {}),
          ...cardPos,
        }}
        onTouchStart={onCardDragStart}
        onTouchEnd={onCardDragEnd}
        ref={cardRef}
        backdropClassName="backdrop-inward"
      >
        <div className="drag-bar" onTouchMove={(e: any) => onCardDrag(e)}>
          <hr />
        </div>
        {props.title && (
          <Offcanvas.Header style={{ paddingTop: '5px' }}>
            <Offcanvas.Title className="display-5">{props.title}</Offcanvas.Title>
          </Offcanvas.Header>
        )}
        <Offcanvas.Body>{props.children || <h1>Nothing to see here</h1>}</Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
