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
