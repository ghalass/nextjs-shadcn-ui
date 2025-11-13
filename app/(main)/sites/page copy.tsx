import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SitesList from "./components/list";

const SitesPage = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Les des sites</CardTitle>
          <CardAction>{/*  */}</CardAction>
        </CardHeader>
        <CardContent>
          <SitesList />
        </CardContent>
        <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
      </Card>
    </div>
  );
};

export default SitesPage;
