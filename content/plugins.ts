import { logoByName, type ToolEntry } from "./logos";
// Names confirmed in the approved profile mock; no local plugin inventory is exposed.
export const plugins: ToolEntry[] = ["Notion", "GitHub", "Gmail", "Slack", "Drive", "Calendar", "Todoist"].map(name => ({ name, logo: logoByName[name] }));
