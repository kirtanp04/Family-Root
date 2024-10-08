import { type Metadata } from "next";
import Page from "../_components/Page";
import Verification from "./Verification";

export const metadata: Metadata = {
  title: "Email verification | Family Roots",
  description:
    "Explore your family's history and connect with relatives on the family page of our intuitive family tree builder.",
  openGraph: {
    title: "Email verification Page - Connect with Your Relatives",
    description:
      "Explore your family's history and connect with relatives using our intuitive family tree builder.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email verification Page - Family Tree Builder",
    description:
      "Explore your family's history and connect with relatives using our family tree builder.",
  },
};

export default function page() {
  return (
    <Page>
      <div className="min-h-[calc(100% - 70px)] m-auto flex w-[100%] items-center justify-center xl:w-[30%]">
        <Verification />
      </div>
    </Page>
  );
}
