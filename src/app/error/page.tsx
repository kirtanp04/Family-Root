import { type Metadata } from "next";
import Page from "../_components/Page";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Error | Family Roots",
  description:
    "Explore your family's history and connect with relatives on the family page of our intuitive family tree builder.",
  openGraph: {
    title: "Error Page - Connect with Your Relatives",
    description:
      "Explore your family's history and connect with relatives using our intuitive family tree builder.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Error Page - Family Tree Builder",
    description:
      "Explore your family's history and connect with relatives using our family tree builder.",
  },
};

const ErrorPage = dynamic(() => import("./ErrorPage"));

export default function page() {
  return (
    <Page>
      <div className="h-calc-100vh-70 m-auto flex w-[100%] items-center justify-center">
        <ErrorPage />
      </div>
    </Page>
  );
}
