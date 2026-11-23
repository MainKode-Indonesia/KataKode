import http from "node:http";
import { spawn } from "node:child_process";
import { timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.AUTODEPLOY_PORT || 3001);
const SECRET = process.env.AUTODEPLOY_SECRET;

const DEPLOY_SCRIPT =
  "/home/naufal/blog.nafeka.my.id/scripts/deploy.sh";

if (!SECRET || SECRET.length < 32) {
  console.error("AUTODEPLOY_SECRET belum dikonfigurasi.");
  process.exit(1);
}

let deploying = false;

function validToken(provided) {
  if (typeof provided !== "string") return false;

  const expected = Buffer.from(SECRET);
  const received = Buffer.from(provided);

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy") {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  if (!validToken(req.headers["x-deploy-secret"])) {
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  if (deploying) {
    res.writeHead(409);
    res.end("Deployment already running");
    return;
  }

  deploying = true;

  const child = spawn(DEPLOY_SCRIPT, [], {
    cwd: "/home/naufal/blog.nafeka.my.id",
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      KATAKODE_TEST_ROLLBACK: "0",
    },
  });

  child.on("error", (error) => {
    console.error("Gagal menjalankan deployment:", error);
    deploying = false;
  });

  child.on("close", (code) => {
    console.log(`Deployment selesai dengan exit code ${code}`);
    deploying = false;
  });

  res.writeHead(202, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify({
    accepted: true,
    message: "Deployment started",
  }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`KataKode Auto-Deploy aktif di 127.0.0.1:${PORT}`);
});
