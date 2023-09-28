import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const url = "https://catalog.data.metro.tokyo.lg.jp/dataset/t000055d0000000363";
const html = await fetchOrLoad(url);
const dom = HTMLParser.parse(html);
const items = dom.querySelectorAll(".resource-item");
const links = items.map(i => {
  const as = i.querySelectorAll(".dropdown-menu a");
  const links = as.map(a => a.getAttribute("href")).filter(s => s.endsWith(".zip"));
  const link = links[0];
  const name = i.querySelector("a.heading").getAttribute("title");
  const description = i.querySelector("p.description").text.trim();
  return { name, description, link };
});
console.log(links);
await Deno.writeTextFile("tokyo-walking-map_1.csv", CSV.stringify(links));

