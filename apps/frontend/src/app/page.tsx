import dynamic from "next/dynamic";

const Home = dynamic(() => import("@src/screens/Home/Home"), {
  ssr: false,
});

export default async function HomePage() {
  return (
   <Home />
  );
}
