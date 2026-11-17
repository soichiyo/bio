// @vitest-environment jsdom
import { act, createElement, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatModal } from "./ChatModal";

const chat = vi.hoisted(() => ({
  status: "ready", error: undefined as Error | undefined,
  sendMessage: vi.fn(), regenerate: vi.fn(), setMessages: vi.fn(), stop: vi.fn(),
  finish: () => {},
}));
vi.mock("@ai-sdk/react", () => ({
  useChat: (options: {onFinish: () => void}) => {
    chat.finish = options.onFinish;
    return {...chat, messages: []};
  },
}));
let root: Root, host: HTMLDivElement;
function Harness() {
  const [open, setOpen] = useState(false);
  return createElement("div", null,
    createElement("button", {onClick: () => setOpen(true)}, "Open"),
    createElement(ChatModal, {isOpen: open, onClose: () => setOpen(false)}),
    createElement("button", null, "Behind"),
  );
}
const button = (name: string) => host.querySelector<HTMLButtonElement>('button[aria-label="'+name+'"]')!;
const input = () => host.querySelector("textarea")!;
async function click(element: HTMLElement) { await act(() => { element.focus(); element.click(); }); }
async function type(value: string) {
  await act(() => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")!.set!.call(input(),value);
    input().dispatchEvent(new Event("input",{bubbles:true}));
  });
}
async function key(key: string, options: KeyboardEventInit = {}) {
  await act(() => { input().dispatchEvent(new KeyboardEvent("keydown",{key,bubbles:true,...options})); });
}
beforeEach(async () => {
  Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT:true});
  Object.defineProperty(window,"matchMedia",{configurable:true,value:()=>({matches:false})});
  HTMLElement.prototype.scrollIntoView = vi.fn();
  // jsdom does not implement modal inertness/focus; the real-browser check covers those.
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open",""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  chat.status="ready";chat.error=undefined;vi.clearAllMocks();
  host=document.createElement("div");document.body.append(host);root=createRoot(host);
  await act(()=>root.render(createElement(Harness)));
  await click(host.querySelector("button")!);
});
afterEach(async () => {await act(()=>root.unmount());host.remove();});
describe("ChatModal",()=>{
  it("names the dialog and controls, focuses input and wraps Tab",async()=>{
    const dialog=host.querySelector("dialog")!;
    expect(dialog.open).toBe(true);
    expect(document.getElementById(dialog.getAttribute("aria-labelledby")!)?.textContent).toBe("Chat with AI Soichiro");
    expect(input().getAttribute("aria-label")).toBe("メッセージ");
    expect(document.activeElement).toBe(input());
    await key("Tab");
    expect(document.activeElement).toBe(button("チャットを閉じる"));
    await act(()=>button("チャットを閉じる").dispatchEvent(new KeyboardEvent("keydown",{key:"Tab",shiftKey:true,bubbles:true})));
    expect(document.activeElement).toBe(input());
  });
  it("uses the same reset and focus restoration for cancel and backdrop",async()=>{
    await type("未送信");
    await act(()=>host.querySelector("dialog")!.dispatchEvent(new Event("cancel",{cancelable:true})));
    expect(host.querySelector("dialog")).toBeNull();
    expect(document.activeElement).toBe(host.querySelector("button"));
    expect(chat.stop).toHaveBeenCalledOnce();expect(chat.setMessages).toHaveBeenCalledWith([]);
    await click(host.querySelector("button")!);
    expect(input().value).toBe("");
    await click(host.querySelector("dialog")!);
    expect(host.querySelector("dialog")).toBeNull();
  });
  it("does not submit during IME composition or Shift+Enter",async()=>{
    await type("こんにちは");
    await key("Enter",{isComposing:true});await key("Enter",{keyCode:229});await key("Enter",{shiftKey:true});
    expect(chat.sendMessage).not.toHaveBeenCalled();
    await key("Enter");
    expect(chat.sendMessage).toHaveBeenCalledExactlyOnceWith({text:"こんにちは"});
    expect(input().value).toBe("");
  });
  it.each(["submitted","streaming"])("can close while %s",async status=>{
    chat.status=status;await act(()=>root.render(createElement(Harness)));
    expect(input().disabled).toBe(true);
    expect(button("メッセージを送信する").disabled).toBe(true);
    await click(button("チャットを閉じる"));
    expect(chat.stop).toHaveBeenCalledOnce();expect(host.querySelector("dialog")).toBeNull();
  });
  it("names retry and can close an error",async()=>{
    chat.error=new Error("synthetic");await act(()=>root.render(createElement(Harness)));
    await click(button("回答を再試行する"));expect(chat.regenerate).toHaveBeenCalledOnce();
    await click(button("チャットを閉じる"));expect(host.querySelector("dialog")).toBeNull();
  });
  it("keeps the 15 turn limit and resets it on reopen",async()=>{
    for(let i=0;i<15;i++) await act(()=>chat.finish());
    expect(input().disabled).toBe(true);expect(host.textContent).toContain("今日はこのへんで");
    await click(button("チャットを閉じる"));
    await act(()=>chat.finish());
    await click(host.querySelector("button")!);
    expect(input().disabled).toBe(false);expect(host.textContent).toContain("残り 15 ターン");
  });
});
