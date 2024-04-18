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

const NULL_PARENT =
  "\\x0000000000000000000000000000000000000000000000000000000000000000";
const RESOURCES = [
  "None",
  "Primary",
  "Kimberlite",
  "Iridium",
  "Platinum",
  "Titanium",
];

const AccountQuery = graphql(`
  query AccountQuery($account: bytea!) {
    viewMapColonies(where: { entity: { _eq: $account } }) {
      entity
      key
      itemKeys
    }
  }
`);

const HomeWorldQuery = graphql(`
  query Map($entity: bytea!) {
    viewPosition(where: { entity: { _eq: $entity } }) {
      entity
      x
      y
    }
  }
`);

const DistanceQuery = graphql(`
  query Box($xLow: Int, $yLow: Int, $xHigh: Int, $yHigh: Int, $parent: bytea!) {
    viewPosition(
      where: {
        x: { _lte: $xHigh, _gte: $xLow }
        y: { _gte: $yLow, _lte: $yHigh }
        parent: { _eq: $parent }
      }
    ) {
      parent
      entity
      x
      y
    }
  }
`);

const AsteroidsQuery = graphql(`
  query Asteroids($asteroids: [bytea!]) {
    viewAsteroid(where: { entity: { _in: $asteroids } }) {
      entity
      isAsteroid
      mapId
    }
  }
`);

export const Leaderboard = () => {
  const [account, setAccount] = useState(
    "0xaD343355A5326bD86C5852eDb4E3272a7467A343"
  );
  const [boxSize, setBoxSize] = useState(100);

  const [accountResult, executeQuery] = useQuery({
    query: AccountQuery,
    variables: {
      account: account.replace("0x", "\\x000000000000000000000000"),
    },
  });

  const itemKeysJson = JSON.parse(
    accountResult.data?.viewMapColonies[0]?.itemKeys || "{}"
  );
  const homeWorldEntity = (itemKeysJson.json || [])[0];
  const [homeWorldResult, executeHomeWorldQuery] = useQuery({
    query: HomeWorldQuery,
    variables: {
      entity: (homeWorldEntity || "").replace("0x", "\\x"),
    },
    pause: !homeWorldEntity,
  });

  const coords = homeWorldResult.data?.viewPosition?.[0];

  const xLow = (coords?.x || 0) - boxSize;
  const xHigh = (coords?.x || 0) + boxSize;
  const yLow = (coords?.y || 0) - boxSize;
  const yHigh = (coords?.y || 0) + boxSize;

  const [distanceQuery, executeDistanceQuery] = useQuery({
    query: DistanceQuery,
    variables: {
      xLow,
      xHigh,
      yLow,
      yHigh,
      parent: NULL_PARENT,
    },
    pause: !coords,
  });

  const [asteroidsQuery, executeAsteroidsQuery] = useQuery({
    query: AsteroidsQuery,
    variables: {
      asteroids:
        distanceQuery.data?.viewPosition?.map((pos) => pos.entity) || [],
    },
    pause: !distanceQuery.data?.viewPosition,
  });

  console.log("asteroids query", asteroidsQuery.data?.viewAsteroid);

  const refetch = useCallback(() => {
    executeQuery({
      requestPolicy: "network-only",
    });
    executeHomeWorldQuery({ requestPolicy: "network-only" });
    executeDistanceQuery({ requestPolicy: "network-only" });
    executeAsteroidsQuery({ requestPolicy: "network-only" });
  }, [
    executeQuery,
    executeHomeWorldQuery,
    executeDistanceQuery,
    executeAsteroidsQuery,
  ]);

  let joinedAsteroids: {
    y?: number | null | undefined;
    x?: number | null | undefined;
    entity: unknown;
    parent?: unknown;
    mapId: unknown;
    isAsteroid: boolean | null;
    distance: number;
  }[] = [];
  if (asteroidsQuery.data?.viewAsteroid) {
    joinedAsteroids = asteroidsQuery.data?.viewAsteroid.map((asteroid) => {
      const pos = distanceQuery.data?.viewPosition.find(
        (pos) => pos.entity === asteroid.entity
      );
      //add a property distance based on the distance formula
      const distance = Math.sqrt(
        Math.pow((pos?.x || 0) - (coords?.x || 0), 2) +
          Math.pow((pos?.y || 0) - (coords?.y || 0), 2)
      );
      return {
        ...asteroid,
        ...pos,
        distance,
      };
    });
  }

  //sort the asteroids by distance
  joinedAsteroids = joinedAsteroids.sort((a, b) => a.distance - b.distance);

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
        Address: <input
            type="text"
            placeholder="0xaD343355A5326bD86C5852eDb4E3272a7467A343"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          /><br/>
          Box Size: <input
            type="text"
            placeholder="Box Size: 100"
            value={boxSize}
            onChange={(e) => setBoxSize(Number(e.target.value))}
          />
          {/* <select>
            <option value="2">Kimberlite</option>
            <option value="3">Iridium</option>
            <option value="4">Platinum</option>
            <option value="5">Titanium</option>
          </select> */}
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
                <TableHead className="">Resource Type</TableHead>
                <TableHead className="text-right">Co-Ordinates</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {joinedAsteroids.map(({ entity, distance, mapId }, i) => (
                <TableRow key={entity as string}>
                  <TableCell>{distance}</TableCell>
                  <TableCell>
                    {RESOURCES[mapId as number] || "Unknown"}
                  </TableCell>
                  <TableCell className="text-right">
                    [{coords?.x}, {coords?.y}]
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
