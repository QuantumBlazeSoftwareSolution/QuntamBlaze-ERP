import { useReducer, useEffect } from "react";

type Action =
  | { type: "ARROW_DOWN" }
  | { type: "ARROW_UP" }
  | { type: "RESET" }
  | { type: "SET_COUNT"; payload: number };

interface State {
  selectedIndex: number;
  itemCount: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ARROW_DOWN":
      return {
        ...state,
        selectedIndex: state.itemCount > 0 ? (state.selectedIndex + 1) % state.itemCount : -1,
      };
    case "ARROW_UP":
      return {
        ...state,
        selectedIndex:
          state.itemCount > 0 ? (state.selectedIndex - 1 + state.itemCount) % state.itemCount : -1,
      };
    case "RESET":
      return { ...state, selectedIndex: -1 };
    case "SET_COUNT":
      return {
        ...state,
        itemCount: action.payload,
        selectedIndex: action.payload > 0 ? 0 : -1, // Select first item if available
      };
    default:
      return state;
  }
}

export function useKeyboardNav(itemCount: number, onEnter?: (index: number) => void) {
  const [state, dispatch] = useReducer(reducer, {
    selectedIndex: -1,
    itemCount,
  });

  // Update item count if it changes (e.g. search results update)
  useEffect(() => {
    dispatch({ type: "SET_COUNT", payload: itemCount });
  }, [itemCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // We only care if we have items
      if (state.itemCount === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        dispatch({ type: "ARROW_DOWN" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        dispatch({ type: "ARROW_UP" });
      } else if (e.key === "Enter" && state.selectedIndex >= 0) {
        e.preventDefault();
        onEnter?.(state.selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.itemCount, state.selectedIndex, onEnter]);

  return {
    selectedIndex: state.selectedIndex,
    reset: () => dispatch({ type: "RESET" }),
  };
}
