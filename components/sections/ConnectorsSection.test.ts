// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConnectorsSection } from "./ConnectorsSection";
import { connectors } from "@/content/connectors";
import { skillTools, skillCounts } from "@/content/skill-tools";

describe("connectors and skills", () => {
  const html = renderToStaticMarkup(createElement(ConnectorsSection));
  const doc = new DOMParser().parseFromString(html, "text/html");

  it("separates connectors with logos from skills with text only", () => {
    expect([...doc.querySelectorAll("h2")].map(el => el.textContent)).toEqual(["Connectors", "Skills"]);
    const lists = doc.querySelectorAll("ul");
    expect([...lists[0].querySelectorAll("li")].map(el => el.textContent)).toEqual(connectors.map(item => item.name));
    for (const item of lists[0].querySelectorAll("li")) expect(item.querySelector("img")).not.toBeNull();
    expect([...lists[1].querySelectorAll("li")].map(el => el.textContent)).toEqual(skillTools);
    expect(lists[1].querySelector("img,svg")).toBeNull();
    for (const removed of ["Plugins", "Notion", "GitHub", "Gmail", "Slack", "Drive", "Calendar", "Todoist"]) {
      expect(doc.body.textContent).not.toContain(removed);
    }
  });

  it("shows both manual counts without depending on a usage snapshot", () => {
    expect([...doc.querySelectorAll("dt")].map(el => el.textContent)).toEqual(["Skills tried", "Custom skills"]);
    expect([...doc.querySelectorAll("dd")].map(el => el.textContent)).toEqual([skillCounts.tried, skillCounts.custom].map(value => value.toLocaleString("en-US")));
    for (const value of Object.values(skillCounts)) {
      expect(Number.isSafeInteger(value) && value >= 0).toBe(true);
    }
    expect(new Set(skillTools).size).toBe(skillTools.length);
    expect(skillTools.every(name => name.trim().length > 0)).toBe(true);
    expect(html).not.toMatch(/\d{4}-\d{2}-\d{2}|本人申告|出典/);
  });
});
