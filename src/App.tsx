import FixedsizeVirtualListPage from "./pages/FixedSizeVirtualListPage";
import VariableSizeVirtualListPage from "./pages/VariableSizeVirtualList";
import { Layout, Tabs, Image } from "antd";
import FS_VL_IMG from "./assets/img/FS_VL.png";
import "./App.css";

const items = [
  {
    label: "固定高度虚拟列表",
    key: "1",
    children: <FixedsizeVirtualListPage />,
  },
  {
    label: "动态高度虚拟列表",
    key: "2",
    children: <VariableSizeVirtualListPage />,
  },
  {
    label: "简单图解",
    key: "3",
    children: <Image src={FS_VL_IMG} alt="简单图解" preview={false} />, // 不可以点击查看
  },
];

export default function App() {
  return (
    <>
      <Layout.Header className="app-header">
        <div className="app-header-title">虚拟列表demo</div>
        <div className="app-header-github">
          <a
            href="https://github.com/8023time/virtuallist-demo"
            target="_blank"
            rel="noreferrer"
            aria-label="打开 GitHub"
            title="GitHub"
          >
            <GithubIcon />
          </a>
        </div>
      </Layout.Header>
      <Layout.Content className="app-content">
        <Tabs items={items} />
      </Layout.Content>
    </>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}
