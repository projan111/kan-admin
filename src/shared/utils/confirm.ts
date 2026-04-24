export async function confirmAction(message: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  return new Promise<boolean>((resolve) => {
    const isDelete = /delete|destroy/i.test(message);

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(15, 23, 42, 0.45)";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";
    overlay.style.zIndex = "2000";

    const modal = document.createElement("div");
    modal.style.width = "min(92vw, 420px)";
    modal.style.border = "1px solid var(--line)";
    modal.style.borderRadius = "14px";
    modal.style.background = "#fff";
    modal.style.boxShadow = "var(--shadow)";
    modal.style.padding = "16px";
    modal.style.display = "grid";
    modal.style.gap = "12px";

    const title = document.createElement("div");
    title.textContent = isDelete ? "Confirm Delete" : "Please Confirm";
    title.style.fontWeight = "800";
    title.style.fontSize = "18px";

    const body = document.createElement("div");
    body.textContent = message;
    body.style.color = "var(--muted)";
    body.style.fontSize = "14px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.style.padding = "8px 12px";
    cancel.style.borderRadius = "8px";
    cancel.style.border = "1px solid var(--line)";
    cancel.style.background = "#fff";
    cancel.style.cursor = "pointer";

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.textContent = isDelete ? "Delete" : "Confirm";
    confirm.style.padding = "8px 12px";
    confirm.style.borderRadius = "8px";
    confirm.style.cursor = "pointer";
    if (isDelete) {
      confirm.style.border = "1px solid #fecaca";
      confirm.style.background = "#fff1f2";
      confirm.style.color = "#be123c";
    } else {
      confirm.style.border = "1px solid var(--primary)";
      confirm.style.background = "var(--primary)";
      confirm.style.color = "#fff";
    }

    const cleanup = () => {
      document.removeEventListener("keydown", onKeyDown);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };

    const close = (result: boolean) => {
      cleanup();
      resolve(result);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };

    cancel.onclick = () => close(false);
    confirm.onclick = () => close(true);
    overlay.onclick = (e) => {
      if (e.target === overlay) close(false);
    };

    actions.append(cancel, confirm);
    modal.append(title, body, actions);
    overlay.append(modal);
    document.body.append(overlay);
    document.addEventListener("keydown", onKeyDown);
    confirm.focus();
  });
}
