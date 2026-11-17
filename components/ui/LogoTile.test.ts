import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { LogoTile } from "./LogoTile";
it("keeps names when no logo is available, without duplicate image labels", () => {
  const plain = renderToStaticMarkup(createElement(LogoTile, {name:"Unconfirmed"}));
  expect(plain).toContain("Unconfirmed");
  expect(plain).not.toContain("<img");
  const known = renderToStaticMarkup(createElement(LogoTile, {name:"GitHub", logo:"github"}));
  expect(known.match(/alt=""/g)).toHaveLength(2);
  expect(known).toContain("GitHub");
});

it("falls back to the name for invalid or inherited logo keys", () => {
  for (const logo of ["", "missing", "toString", "__proto__"]) {
    const html=renderToStaticMarkup(createElement(LogoTile,{name:"Example",logo}));
    expect(html).toContain("Example");expect(html).not.toContain("<img");
  }
});

it("supports stacked media labels while keeping the official icon canvas", () => {
  const html=renderToStaticMarkup(createElement(LogoTile,{name:"note",logo:"note",stacked:true}));
  expect(html).toContain("flex-col");expect(html).toContain('width="40"');
  expect(html).toContain('alt=""');expect(html).toContain("note");
});
