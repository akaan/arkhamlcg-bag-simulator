import { VNode } from "@cycle/dom";

function isVNodeEmpty(vtree: VNode): boolean {
  return vtree.text == null && vtree.children == null;
}

export function vtreeContainsText(vtree: VNode, text: string): boolean {
  if (isVNodeEmpty(vtree)) {
    return false;
  }
  return (
    (vtree.text != null && vtree.text.includes(text)) ||
    (vtree.children != null &&
      vtree.children.some(childTree => {
        if (childTree instanceof String) {
          return (childTree as string).includes(text);
        } else {
          return vtreeContainsText(childTree as VNode, text);
        }
      }))
  );
}
