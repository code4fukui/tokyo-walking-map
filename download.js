import { CSV } from "https://js.sabae.cc/CSV.js";
import { fetchBin } from "https://js.sabae.cc/fetchBin.js";
import { unzip } from "https://taisukef.github.io/zlib.js/es/unzip.js";

const data = await CSV.fetchJSON("tokyo-walking-map_1.csv");
for (const d of data) {
  const bin = await fetchBin(d.link);
  //const path = "data/" + d.link.substring(d.link.lastIndexOf("/") + 1);
  //await Deno.writeFile(path, bin);
  //const bin = await Deno.readFile(path);
  const zips = unzip(bin);
  const fns = zips.getFilenames();
  if (fns.length != 1) {
    throw new Error(fn.length + " files contains");
  }
  for (const fn of fns) {
    const f = zips.decompress(fn);
    console.log(fn);
    await Deno.writeFile("data/" + fn, f);
    d.link = "data/" + fn;
  }
}
await Deno.writeTextFile("tokyo-walking-map_2.csv", CSV.stringify(data));
