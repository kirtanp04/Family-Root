import { type Metadata } from "next";

import dynamic from "next/dynamic";
import Page from "../_components/Page";

export const metadata: Metadata = {
  title: "Family List | Family Roots",
  description:
    "Explore your family's history and connect with relatives on the family page of our intuitive family tree builder.",
  openGraph: {
    title: "Family Page - Connect with Your Relatives",
    description:
      "Explore your family's history and connect with relatives using our intuitive family tree builder.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Page - Family Tree Builder",
    description:
      "Explore your family's history and connect with relatives using our family tree builder.",
  },
};

const FamilyListPage = dynamic(() => import("./FamilyList"), {
  loading: () => <p>Loading...</p>,
});

export default async function FamilyPage() {
  // await GetCookieValue();
  return (
    <Page>
      <FamilyListPage />
    </Page>
  );
}
