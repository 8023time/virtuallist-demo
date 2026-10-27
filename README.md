# 虚拟列表 Demo

这是一个使用 React 和 TypeScript 编写的虚拟列表学习项目。

项目中实现了两种虚拟列表：

- 固定高度列表
- 动态高度列表

## 虚拟列表原理

普通列表会一次性渲染所有数据，数据量较大时可能造成页面卡顿。

虚拟列表只渲染当前可见区域附近的数据，并使用一个占位容器撑起完整的滚动高度。

```text
滚动容器
└── 占位容器
    └── 可见区域和缓冲区数据
```

## 固定高度列表

组件：

[`src/components/FixedSizeVirtualList/index.tsx`](./src/components/FixedSizeVirtualList/index.tsx)

每一项高度相同，可以直接计算项目位置：

```ts
const startIndex = Math.floor(scrollTop / itemHeight);
const offset = index * itemHeight;
```

## 动态高度列表

组件：

[`src/components/VariableSizeVirtualList/index.tsx`](./src/components/VariableSizeVirtualList/index.tsx)

每一项高度不同，不能直接使用 `index * itemHeight` 计算位置。

组件会先使用 `estimatedHeight` 作为预估高度，项目渲染后通过 `ResizeObserver` 获取真实高度，再重新计算后续项目的位置。

大致流程：

```text
使用预估高度
    ↓
计算可见区域
    ↓
渲染可见项目
    ↓
测量真实高度
    ↓
更新项目位置和列表总高度
```

## 项目结构

```text
src/
├── components/
│   ├── FixedSizeVirtualList/
│   └── VariableSizeVirtualList/
├── pages/
│   ├── FixedSizeVirtualListPage.tsx
│   └── VariableSizeVirtualList.tsx
└── App.tsx
```

这个项目主要用于理解虚拟列表的基本实现，不是生产环境组件。
