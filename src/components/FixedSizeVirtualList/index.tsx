import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./index.css";

export const BUFFER_COUNT = 5;

export interface FixedSizeVirtualListProps<T> {
  data: T[];
  itemHeight: number;
  totalCount: number;
  style?: CSSProperties;
  itemRenderer?: (item: T, index: number) => ReactNode;
}

export default function FixedSizeVirtualList<T>({
  data,
  itemHeight,
  totalCount,
  style,
  itemRenderer,
}: FixedSizeVirtualListProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0); // 视口高度
  const [scrollTop, setScrollTop] = useState(0); // 当前滚动位置

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // 视口尺寸变化时重新计算可见区域
    const updateViewportHeight = () => setViewportHeight(viewport.clientHeight);
    updateViewportHeight();
    const resizeObserver = new ResizeObserver(updateViewportHeight);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  // 根据滚动位置计算可视区域的起始和结束索引
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    totalCount - 1,
    Math.ceil((scrollTop + viewportHeight) / itemHeight),
  );

  // 在可视区域前后增加缓冲数据，避免快速滚动时出现空白
  const renderStartIndex = Math.max(0, startIndex - BUFFER_COUNT);
  const renderEndIndex = Math.min(totalCount - 1, endIndex + BUFFER_COUNT);
  const dataToRender = data.slice(renderStartIndex, renderEndIndex + 1);

  return (
    <div
      className="FS-virtual-list-viewport"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      style={style}
      ref={viewportRef}
    >
      {/* 占位区域，用于撑开容器高度 */}
      <div
        className="FS-virtual-list-spacer"
        style={{ height: itemHeight * totalCount }}
      >
        {/* 数据渲染区域：缓冲区数据 + 可视区域数据 */}
        <div
          className="FS-virtual-list-content"
          style={{
            transform: `translateY(${renderStartIndex * itemHeight}px)`,
          }}
        >
          {/* 可视区域数据 */}
          {dataToRender.map((item, index) => (
            <div
              className="FS-virtual-list-item"
              key={renderStartIndex + index}
              style={{ height: itemHeight }}
            >
              {itemRenderer?.(item, renderStartIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
