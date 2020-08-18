import * as exec from 'await-exec'

function createServerResponse(ip: string, port: string): object {
  return {
    url: "http://" + ip + ":" + port
  }
}

function sendMessage(res, code: number, message: string): void {
  res.status(code);
  res.send(message);
}

export const GameServerState: Record<string, string> = {
  Allocated: "Allocated",
  UnAllocated: "UnAllocated"
}

// Hack for getting public URL of node
const IpPrivateToPublicMap: Map<string, string> = new Map([
  ["10.240.0.5", "13.86.114.94"],
  ["10.240.0.6", "13.86.113.254"],
  ["10.240.0.7", "13.86.117.60"],
  ["10.240.0.8", "13.86.116.152"]
]);

function translateLocalIpToProd(ip: string): string {
  return IpPrivateToPublicMap.has(ip) ? IpPrivateToPublicMap.get(ip) : ip;
}

export async function requestServer(_, res): Promise<void> {
  if (!process.env.AGONES) {
    res.json(createServerResponse("localhost", "3000"));
    return;
  }

  let execution;
  let allocation;
  try {
    // Try to get an allocation of a gameserver
    execution = await exec("kubectl create -f /usr/src/app/kubeConfig/allocation.yaml -o json")
    allocation = JSON.parse(execution.stdout);
  } catch (ex) {
    // Log an issue during execution and parsing
    console.log(ex);
    console.log(execution);
    sendMessage(res, 500, "There was an issue with your request");
    return;
  }
  switch (allocation?.status?.state) {
  case GameServerState.Allocated:
    res.json(createServerResponse(
      translateLocalIpToProd(allocation.status.address),
      allocation.status.ports[0].port
    ));
    return;
  case GameServerState.UnAllocated: {
    sendMessage(res, 404, "No game servers are available at this time");
    return;
  }
  default:
    console.log(execution);
    console.log(allocation);
    sendMessage(res, 400, "Game server is in unknown state");
  }
}