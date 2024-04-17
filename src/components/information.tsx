import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book } from "lucide-react";
import { Badge } from "./ui/badge";

type CardProps = React.ComponentProps<typeof Card>;

export function Information({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-full h-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/icon.png" className="w-[1em] rounded pixel-images" />
          Primodium Client Lite Template
        </CardTitle>
        <CardDescription>
          This template allows you to quickly build lightweight read-only
          clients that fetch from our graphql endpoint.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className=" flex items-center space-x-4 rounded-md border border-emerald-500/50 p-4">
          <div className="flex-1 space-y-5">
            <p className="text-sm font-medium leading-none">Getting Started</p>
            <div className="text-sm text-muted-foreground font-mono border rounded p-2">
              npm create primodium@latest --template react-client-lite
            </div>
          </div>
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-5 w-full">
            <p className="w-full text-sm font-medium leading-none">
              GraphQL Endpoint
            </p>

            <div className="text-sm text-muted-foreground font-mono border rounded p-2 break-words">
              https://graphql.primodium.ai/v1/graphql
            </div>
          </div>
        </div>

        <p>For more information visit:</p>
        <a
          href="https://developer.primodium.com"
          target="_blank"
          referrerPolicy="no-referrer"
          className=""
        >
          <Button className="w-full gap-2" variant={"outline"}>
            <Book />
            Developer Docs
          </Button>
        </a>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap ">
        <p className="opacity-50 text-xs">built with</p>{" "}
        <Badge variant={"secondary"}>gql.tada</Badge>
        <Badge variant={"secondary"}>shadcn/ui</Badge>
        <Badge variant={"secondary"}>react+vite</Badge>
      </CardFooter>
    </Card>
  );
}
