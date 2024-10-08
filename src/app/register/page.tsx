import { type Metadata } from "next";
import Page from "../_components/Page";
import Register from "./Register";

export const metadata: Metadata = {
  title: "Register | Family Roots",
  description:
    "Explore your family's history and connect with relatives on the family page of our intuitive family tree builder.",
  openGraph: {
    title: "Register Page - Connect with Your Relatives",
    description:
      "Explore your family's history and connect with relatives using our intuitive family tree builder.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register Page - Family Tree Builder",
    description:
      "Explore your family's history and connect with relatives using our family tree builder.",
  },
};

export default function page() {
  return (
    <Page>
      <div className="min-h-[calc(100% - 70px)] m-auto flex w-[100%] items-center justify-center md:w-[40%] lg:w-[35%] xl:w-[30%]">
        <Register />
      </div>
    </Page>
  );
}
