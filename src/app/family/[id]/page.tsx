import { type Metadata } from "next";
import dynamic from "next/dynamic";
import Page from "~/app/_components/Page";

export const metadata: Metadata = {
  title: "Family Tree Viewer | Family Roots",
  description:
    "View and explore your family's tree, connecting with relatives and discovering your heritage through our interactive family tree viewer.",
  openGraph: {
    title: "Family Tree Viewer - Connect with Your Heritage",
    description:
      "Discover and explore your family's tree, connecting with relatives using our interactive family tree viewer.",
  },
  twitter: {
    title: "Family Tree Viewer - Family Roots",
    description:
      "Explore and view your family's tree while connecting with relatives using our interactive family tree viewer.",
  },
};

const ReactFlow = dynamic(() => import("./components/ReactFlowProvider"), {
  loading: () => <p>Loading...</p>,
  ssr: true,
});

export default function page() {
  return (
    <Page>
      <ReactFlow />
    </Page>
  );
}
