import { useCallback, useState } from "react";
import { graphql } from "gql.tada";
import { useQuery } from "urql";
import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { hexToAddress, parseHex, shortenAddress } from "@/lib/utils";

const LEADERBOARD_SIZE = 10;

const AccountQuery = graphql(`
  query AccountQuery($account: bytea!) {
    viewMapColonies(where: { entity: { _eq: $account } }) {
      entity
      key
      itemKeys
    }
  }
`);

export const Leaderboard = () => {
  const [account, setAccount] = useState("0xaD343355A5326bD86C5852eDb4E3272a7467A343");

  const [accountResult, executeQuery] = useQuery({
    query: AccountQuery,
    variables: {
      account: account.replace("0x", '\\x000000000000000000000000'),
    },
  });

  console.log("account", account.replace("0x", "\\x000000000000000000000000"));

  const refetch = useCallback(() => {
    executeQuery({
      requestPolicy: "network-only",
    });
  }, [executeQuery]);

  console.log("Result", accountResult.data);

  return (
    <Card className="w-full relative">
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            onClick={refetch}
            variant={"outline"}
            className="absolute top-5 right-5"
          >
            <RefreshCcw
              className={`w-[1.2rem] h-[1.2rem] ${
                accountResult.fetching ? "animate-spin" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Find</TooltipContent>
      </Tooltip>

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Find the closest Mineral
        </CardTitle>
        <CardDescription>
          <input placeholder="address"></input>
          <select>
            <option value="2">Kimberlite</option>
            <option value="3">Iridium</option>
            <option value="4">Platinum</option>
            <option value="5">Titanium</option>
          </select>
        </CardDescription>
      </CardHeader>

      {!accountResult.data && (
        <p className="text-center m-10 text-xl font-bold">Loading Data</p>
      )}
      {accountResult.data && (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Distance from You</TableHead>
                <TableHead className="">Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accountResult.data?.viewMapColonies?.map(({ entity, value }, i) => (
                <TableRow key={entity as string}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {shortenAddress(hexToAddress(parseHex(entity as string)))}
                  </TableCell>
                  <TableCell className="text-right">
                    {(
                      Number(BigInt(value as string)) /
                      10 ** 18
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};