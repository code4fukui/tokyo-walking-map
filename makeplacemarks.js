import { CSV } from "https://js.sabae.cc/CSV.js";
//import { DOMParser as XMLDOMParser } from "https://code4fukui.github.io/xmldom-es/xmldom.js";
import { XML } from "https://js.sabae.cc/XML.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

const data = await CSV.fetchJSON("tokyo-walking-map_2.csv");

const make = async (flgja) => {
  const text = (s) => {
    if (!s) return s;
    let ss = s.split("／");
    if (ss.length == 1) {
      ss = s.split("/");
    }
    if (ss.length != 2) {
      if (s == "無題のレイヤ") {
        return flgja ? s : "no name layer";
      }
      if (s == "ゴール/Goal") {
        return flgja ? "ゴール" : "Goal";
      }
      if (s == "延命寺にある250kg爆弾／Enmeiji temple／250-kilogram bomb at Enmeiji Temple") {
        return flgja ? "延命寺にある250kg爆弾" : "250-kilogram bomb at Enmeiji Temple";
      }
      if (s == "日野駅") {
        return flgja ? s : "Hino station";
      }
      if (s == "ウォーキングポイント") {
        return flgja ? s : "Walking point";
      }
      if (s == "バス停（路線バス）") {
        return flgja ? s : "Bus stop";
      }
      return s;
      /*
      if (s == "AED" || s == "Cafe VertVert" || s == "1" || s.length == 1 || s == "2K540" || s == "SEKAI CAFE Oshiage" || s == "Café Tokyo") {
        return s;
      }
      console.log(s);
      throw new Error("err", s);
      */
    }
    return flgja ? ss[0] : ss[1];
  };
  const list = [];
  for (const d of data) {
    const xml = await Deno.readTextFile(d.link);
    /*
    const dom = new XMLDOMParser().parseFromString(xml, "text/xml");
    console.log(dom);
    const folders = dom.querySelectorAll("Folder");
    */
    const json = XML.toJSON(xml);
    //console.log(json);
    const folders = json.kml.Document.Folder;
    for (const folder of folders) {
      const pmarks = Array.isArray(folder.Placemark) ? folder.Placemark : [folder.Placemark];
      if (!pmarks) continue;
      for (const p of pmarks) {
        if (!p) continue;
        if (p.Point) {
          const ll = p.Point.coordinates["#text"].split(",");
          list.push({
            name: text(p.name["#text"]),
            description: text(p.description ? p.description["#text"] : ""),
            lat: ll[1],
            lng: ll[0],
            //folder: text(folder.name["#text"]),
          });
        }
        // LineString // まずは only Point
      }
    }
  }
  console.log(list.length);
  const list2 = ArrayUtil.toUnique(list, s => s.lat + "," + s.lng);

  console.log(list2.length);
  await Deno.writeTextFile(`tokyo-walking-map_placemark_${flgja ? "ja" : "en"}.csv`, CSV.stringify(list2));
};

make(true);
make(false);
