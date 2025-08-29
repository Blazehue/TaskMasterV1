/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";

export const CHANNEL = "ORCHIDS_HOVER_v1" as const;

// Deduplicate helper for high-frequency traffic (HIT / FOCUS_MOVED / SCROLL)
// -----------------------------------------------------------------------------
let _orchidsLastMsg = "";
const postMessageDedup = (data: any) => {
  try {
    const key = JSON.stringify(data);
    if (key === _orchidsLastMsg) return; // identical – drop
    _orchidsLastMsg = key;
  } catch {
    // if stringify fails, fall through
  }
  window.parent.postMessage(data, "*");
};

export type ParentToChild =
  | { type: typeof CHANNEL; msg: "POINTER"; x: number; y: number }
  | { type: typeof CHANNEL; msg: "VISUAL_EDIT_MODE"; active: boolean }
  | { type: typeof CHANNEL; msg: "SCROLL"; dx: number; dy: number }
  | { type: typeof CHANNEL; msg: "CLEAR_INLINE_STYLES"; elementId: string }
  | {
      type: typeof CHANNEL;
      msg: "PREVIEW_FONT";
      elementId: string;
      fontFamily: string;
    }
  | {
      type: typeof CHANNEL;
      msg: "RESIZE_ELEMENT";
      elementId: string;
      width: number;
      height: number;
    }
  | {
      type: typeof CHANNEL;
      msg: "SHOW_ELEMENT_HOVER";
      elementId: string | null;
    };

export type ChildToParent =
  | {
      type: typeof CHANNEL;
      msg: "HIT";
      id: string | null;
      tag: string | null;
      rect: { top: number; left: number; width: number; height: number } | null;
    }
  | {
      type: typeof CHANNEL;
      msg: "ELEMENT_CLICKED";
      id: string | null;
      tag: string | null;
      rect: { top: number; left: number; width: number; height: number };
      clickPosition: { x: number; y: number };
      isEditable?: boolean;
      currentStyles?: {
        fontSize?: string;
        color?: string;
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        textAlign?: string;
        lineHeight?: string;
        letterSpacing?: string;
        paddingLeft?: string;
        paddingRight?: string;
        paddingTop?: string;
        paddingBottom?: string;
        marginLeft?: string;
        marginRight?: string;
        marginTop?: string;
        marginBottom?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        borderRadius?: string;
        fontFamily?: string;
        opacity?: string;
        display?: string;
        flexDirection?: string;
        alignItems?: string;
        justifyContent?: string;
        gap?: string;
      };
      className?: string;
      src?: string;
    }
  | { type: typeof CHANNEL; msg: "SCROLL_STARTED" }
  | { type: typeof CHANNEL; msg: "SCROLL_STOPPED" }
  | {
      type: typeof CHANNEL;
      msg: "TEXT_CHANGED";
      id: string;
      text: string;
    }
  | {
      type: typeof CHANNEL;
      msg: "FOCUS_MOVED";
      id: string | null;
      tag: string | null;
      rect: { top: number; left: number; width: number; height: number } | null;
    }
  | {
      type: typeof CHANNEL;
      msg: "VISUAL_EDIT_MODE";
      active: boolean;
    }
  | {
      type: typeof CHANNEL;
      msg: "FOCUSED_ELEMENT";
      id: string | null;
      tag: string | null;
      rect: { top: number; left: number; width: number; height: number } | null;
    }
  | {
      type: typeof CHANNEL;
      msg: "SCROLL";
      dx: number;
      dy: number;
    }
  | {
      type: typeof CHANNEL;
      msg: "POINTER";
      x: number;
      y: number;
    };

export default function VisualEditsMessenger() {
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);

  const [lastHitElement, setLastHitElement] = useState<HTMLElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== CHANNEL) return;

      const { msg, ...data } = event.data;

      switch (msg) {
        case "VISUAL_EDIT_MODE":
          setIsVisualEditMode(data.active);
          break;
        case "POINTER":
          setLastPointerPosition({ x: data.x, y: data.y });
          break;
        case "SCROLL":
          // Handle scroll commands if needed
          break;
        case "CLEAR_INLINE_STYLES":
          const element = document.getElementById(data.elementId);
          if (element) {
            element.removeAttribute("style");
          }
          break;
        case "PREVIEW_FONT":
          const fontElement = document.getElementById(data.elementId);
          if (fontElement) {
            fontElement.style.fontFamily = data.fontFamily;
          }
          break;
        case "RESIZE_ELEMENT":
          const resizeElement = document.getElementById(data.elementId);
          if (resizeElement) {
            resizeElement.style.width = `${data.width}px`;
            resizeElement.style.height = `${data.height}px`;
          }
          break;
        case "SHOW_ELEMENT_HOVER":
          // Handle element hover display
          break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisualEditMode) return;

      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const id = element.id || element.getAttribute("data-orchids-id");

      if (id && element !== lastHitElement) {
        setLastHitElement(element);
        
        if (hitTimeoutRef.current) {
          clearTimeout(hitTimeoutRef.current);
        }

        hitTimeoutRef.current = setTimeout(() => {
          postMessageDedup({
            type: CHANNEL,
            msg: "HIT",
            id,
            tag: element.tagName.toLowerCase(),
            rect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            },
          });
        }, 50);
      }

      // Send pointer position
      postMessageDedup({
        type: CHANNEL,
        msg: "POINTER",
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (!isVisualEditMode) return;

      const element = e.target as HTMLElement;
      const rect = element.getBoundingClientRect();
      const id = element.id || element.getAttribute("data-orchids-id");

      postMessageDedup({
        type: CHANNEL,
        msg: "ELEMENT_CLICKED",
        id,
        tag: element.tagName.toLowerCase(),
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        clickPosition: { x: e.clientX, y: e.clientY },
        isEditable: element.contentEditable === "true",
        currentStyles: {
          fontSize: window.getComputedStyle(element).fontSize,
          color: window.getComputedStyle(element).color,
          fontWeight: window.getComputedStyle(element).fontWeight,
          fontStyle: window.getComputedStyle(element).fontStyle,
          textDecoration: window.getComputedStyle(element).textDecoration,
          textAlign: window.getComputedStyle(element).textAlign,
          lineHeight: window.getComputedStyle(element).lineHeight,
          letterSpacing: window.getComputedStyle(element).letterSpacing,
          paddingLeft: window.getComputedStyle(element).paddingLeft,
          paddingRight: window.getComputedStyle(element).paddingRight,
          paddingTop: window.getComputedStyle(element).paddingTop,
          paddingBottom: window.getComputedStyle(element).paddingBottom,
          marginLeft: window.getComputedStyle(element).marginLeft,
          marginRight: window.getComputedStyle(element).marginRight,
          marginTop: window.getComputedStyle(element).marginTop,
          marginBottom: window.getComputedStyle(element).marginBottom,
          backgroundColor: window.getComputedStyle(element).backgroundColor,
          backgroundImage: window.getComputedStyle(element).backgroundImage,
          borderRadius: window.getComputedStyle(element).borderRadius,
          fontFamily: window.getComputedStyle(element).fontFamily,
          opacity: window.getComputedStyle(element).opacity,
          display: window.getComputedStyle(element).display,
          flexDirection: window.getComputedStyle(element).flexDirection,
          alignItems: window.getComputedStyle(element).alignItems,
          justifyContent: window.getComputedStyle(element).justifyContent,
          gap: window.getComputedStyle(element).gap,
        },
        className: element.className,
        src: (element as HTMLImageElement).src,
      });
    };

    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
        postMessageDedup({
          type: CHANNEL,
          msg: "SCROLL_STARTED",
        });
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        postMessageDedup({
          type: CHANNEL,
          msg: "SCROLL_STOPPED",
        });
      }, 150);

      postMessageDedup({
        type: CHANNEL,
        msg: "SCROLL",
        dx: window.scrollX - lastPointerPosition.x,
        dy: window.scrollY - lastPointerPosition.y,
      });
    };

    const handleFocus = (e: FocusEvent) => {
      if (!isVisualEditMode) return;

      const element = e.target as HTMLElement;
      const rect = element.getBoundingClientRect();
      const id = element.id || element.getAttribute("data-orchids-id");



      postMessageDedup({
        type: CHANNEL,
        msg: "FOCUSED_ELEMENT",
        id,
        tag: element.tagName.toLowerCase(),
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      });
    };

    const handleBlur = () => {
      if (!isVisualEditMode) return;



      postMessageDedup({
        type: CHANNEL,
        msg: "FOCUSED_ELEMENT",
        id: null,
        tag: null,
        rect: null,
      });
    };

    const handleInput = (e: Event) => {
      if (!isVisualEditMode) return;

      const element = e.target as HTMLElement;
      const id = element.id || element.getAttribute("data-orchids-id");

      if (id) {
        postMessageDedup({
          type: CHANNEL,
          msg: "TEXT_CHANGED",
          id,
          text: element.textContent || (element as HTMLInputElement).value || "",
        });
      }
    };

    // Add event listeners
    window.addEventListener("message", handleMessage);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    document.addEventListener("input", handleInput);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
      document.removeEventListener("input", handleInput);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hitTimeoutRef.current) {
        clearTimeout(hitTimeoutRef.current);
      }
    };
  }, [isVisualEditMode, lastHitElement, lastPointerPosition]);

  // Send initial state
  useEffect(() => {
    postMessageDedup({
      type: CHANNEL,
      msg: "VISUAL_EDIT_MODE",
      active: isVisualEditMode,
    });
  }, [isVisualEditMode]);

  return null; // This component doesn't render anything visible
}
