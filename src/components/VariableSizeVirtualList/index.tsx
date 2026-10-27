import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, UIEvent } from "react";
import "./index.css";

export const BUFFER_COUNT = 5;

export interface VariableSizeVirtualListProps<T> {
  data: T[];
  style?: CSSProperties;
  estimatedHeight?: number;
  itemRenderer?: (item: T, index: number) => ReactNode;
}

interface ItemMetadata {
  offset: number; // 项目距离列表顶部的位置
  size: number; // 项目高度
  measured: boolean; // 是否已经测量真实高度
}

interface InstanceProps {
  itemMetadataMap: Record<number, ItemMetadata>; // 缓存每个项目的元数据
  lastMeasuredIndex: number; // 已测量的最后一个项目索引
  estimatedItemSize: number; // 预估的项目高度，用于未测量的项目
}

export default function VariableSizeVirtualList<T>({
  data,
  style,
  estimatedHeight = 50,
  itemRenderer,
}: VariableSizeVirtualListProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const instanceProps = useRef<InstanceProps>({
    itemMetadataMap: {},
    lastMeasuredIndex: -1,
    estimatedItemSize: estimatedHeight,
  }).current;
  const [scrollTop, setScrollTop] = useState(0);
  const [, forceUpdate] = useState(0); // 高度变化后强制重新计算布局

  // ==================== 核心工具函数 ==================== //

  /**
   * 获取项目的位置和高度。未测量的项目先使用预估高度。
   * 1. 如果已经测量过，直接返回缓存的元数据。
   * 2. 如果未测量过，使用预估高度计算 offset，并缓存元数据。
   * @param index 项目索引
   * @returns 项目的元数据
   */
  const getMetadata = useCallback((index: number) => {
    const { itemMetadataMap, lastMeasuredIndex, estimatedItemSize } =
      instanceProps;

    // 如果已经测量过，直接返回缓存的元数据
    if (index <= lastMeasuredIndex) return itemMetadataMap[index];

    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const lastItem = itemMetadataMap[lastMeasuredIndex];
      offset = lastItem.offset + lastItem.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      itemMetadataMap[i] = {
        offset,
        size: estimatedItemSize,
        measured: false,
      };
      offset += estimatedItemSize;
    }
    instanceProps.lastMeasuredIndex = index;
    return itemMetadataMap[index];
  }, []);

  /**
   * 更新项目的真实高度，并同步调整后续项目的 offset。
   * 1. 如果高度没有变化，则不触发重新渲染，避免 ResizeObserver 形成更新循环。
   * 2. 如果高度变化，则更新缓存的元数据，并调整后续项目的 offset。
   * 3. 最后触发强制刷新，重新计算布局。
   * @param index 项目索引
   * @param size 项目的真实高度
   */
  const updateItemSize = useCallback(
    (index: number, size: number) => {
      const metadata = getMetadata(index);
      // 高度没有变化时不触发重新渲染，避免 ResizeObserver 形成更新循环
      if (metadata.measured && Math.abs(metadata.size - size) < 1) return;

      // 当前项目高度变化后，后续项目的 offset 都要同步调整
      const delta = size - metadata.size;
      metadata.size = size;
      metadata.measured = true;

      for (let i = index + 1; i <= instanceProps.lastMeasuredIndex; i++) {
        instanceProps.itemMetadataMap[i].offset += delta;
      }

      forceUpdate((version) => version + 1);
    },
    [getMetadata],
  );

  /**
   * 计算列表的总高度。
   * 1. 已测量的项目使用真实高度，未测量的项目使用预估高度。
   * @returns 列表总高度
   */
  function getTotalHeight() {
    const { itemMetadataMap, lastMeasuredIndex, estimatedItemSize } =
      instanceProps;
    const lastIndex = Math.min(data.length - 1, lastMeasuredIndex);
    const last = itemMetadataMap[lastIndex];

    // 没有测量数据时，使用所有项目的预估高度
    if (!last || lastIndex < 0) return data.length * estimatedItemSize;

    // 已测量部分使用真实高度，未测量部分使用预估高度
    const unmeasuredCount = data.length - lastIndex - 1;
    return last.offset + last.size + unmeasuredCount * estimatedItemSize;
  }

  /**
   * 根据当前滚动位置计算需要渲染的项目范围。
   * 1. 使用二分查找定位可视区域的起始项目。
   * 2. 向后查找可视区域的结束项目。
   * 3. 在前后增加缓冲项目，避免快速滚动时出现空白。
   * @returns 需要渲染的起始索引和结束索引
   */
  function getRangeToRender() {
    if (data.length === 0) {
      return { start: 0, end: -1 };
    }

    const viewportHeight = viewportRef.current?.clientHeight ?? 0;
    let left = 0;
    let right = data.length - 1;

    // 使用二分查找，根据 scrollTop 定位可视区域的起始项目
    while (left < right) {
      const middle = Math.floor((left + right) / 2);
      const metadata = getMetadata(middle);

      if (metadata.offset + metadata.size > scrollTop) {
        right = middle;
      } else {
        left = middle + 1;
      }
    }

    const startIndex = left;
    let endIndex = startIndex;

    // 从起始项目向后查找，直到覆盖整个视口
    while (
      endIndex < data.length - 1 &&
      getMetadata(endIndex).offset < scrollTop + viewportHeight
    ) {
      endIndex++;
    }

    // 在可视区域前后增加缓冲项目
    return {
      start: Math.max(0, startIndex - BUFFER_COUNT),
      end: Math.min(data.length - 1, endIndex + BUFFER_COUNT),
    };
  }

  // ==================== 获取渲染数据 ==================== //

  const { start, end } = getRangeToRender();
  const totalHeight = getTotalHeight();
  const items = [];

  for (let index = start; index <= end; index++) {
    const { offset } = getMetadata(index);
    items.push(
      <MeasuredItem
        key={index}
        index={index}
        offset={offset}
        onSizeChange={updateItemSize}
      >
        {itemRenderer?.(data[index], index)}
      </MeasuredItem>,
    );
  }

  // ==================== 事件处理 ==================== //

  /**
   * 更新当前滚动位置。
   * @param event 滚动事件
   */
  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setScrollTop(event.currentTarget.scrollTop);
  }

  return (
    <div
      ref={viewportRef}
      className="VS-virtual-list-viewport"
      style={style}
      onScroll={handleScroll}
    >
      <div className="VS-virtual-list-spacer" style={{ height: totalHeight }}>
        <div className="VS-virtual-list-content">{items}</div>
      </div>
    </div>
  );
}

interface MeasuredItemProps {
  index: number;
  offset: number;
  onSizeChange: (index: number, size: number) => void;
  children: ReactNode;
}

function MeasuredItem({
  index,
  offset,
  onSizeChange,
  children,
}: MeasuredItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;

    let frameId = 0;
    let lastHeight = 0;

    /**
     * 延迟到下一帧测量，避免在 ResizeObserver 回调中直接更新状态。
     */
    const measure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const height = element.getBoundingClientRect().height;
        if (height > 0 && Math.abs(height - lastHeight) >= 1) {
          lastHeight = height;
          onSizeChange(index, height);
        }
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [index, onSizeChange]);

  return (
    <div ref={itemRef} className="VS-virtual-list-item" style={{ top: offset }}>
      {children}
    </div>
  );
}
