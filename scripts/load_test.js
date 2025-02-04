import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

const BASE_URL = "http://localhost:8091";

export default function () {
  let apiRes = http.get(`${BASE_URL}/categories`);
  check(apiRes, {
    "products API status is 200": (r) => r.status === 200,
    "products API returns data": (r) => r.json().length > 0,
  });

  sleep(1);
}
