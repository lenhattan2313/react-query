import { createContext, useContext, useSyncExternalStore } from "react";
import "./App.css";
import BatchUpdating from "./BatchUpdating";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import HomePage from "./components/Home.page";
import RQSuperHeroesPage from "./components/RQSuperheros.page";
import SuperHeroesPage from "./components/Superheros.page";
import RQSuperheroDetail from "./components/RQSuperheroDetail";
type Store = {
  first: string;
  last: string;
};
const initialValue: Store = {
  first: "",
  last: "",
};
function useStoreData(): {
  get: () => Store;
  set: (value: Partial<Store>) => void;
  subscriber: (callback: () => void) => () => void;
} {
  const subscriber = new Set<() => void>();
  let currentValue = initialValue;
  return {
    get: () => currentValue,
    set: (value: Partial<Store>) => {
      currentValue = { ...currentValue, ...value };
      subscriber && subscriber.forEach((s) => s());
    },
    subscriber: (listener: () => void) => {
      subscriber.add(listener);
      return () => {
        subscriber.delete(listener);
      };
    },
  };
}
function useStore<SelectorOutput>(
  selector: (store: Store) => SelectorOutput
): [SelectorOutput, (value: Partial<Store>) => void] {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Store not found");
  }

  const state = useSyncExternalStore(store.subscriber, () =>
    selector(store.get())
  );

  return [state, store.set];
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;
const StoreContext = createContext<UseStoreDataReturnType | null>(null);
const TextInput = ({ value }: { value: "first" | "last" }) => {
  const [store, setStore] = useStore((store) => store[value])!;

  return (
    <div>
      {value}:
      <input
        className="border-cyan-600 border p-2 m-2"
        value={store}
        onChange={(e) => setStore({ [value]: e.target.value })}
      />
    </div>
  );
};
const Display = ({ value }: { value: "first" | "last" }) => {
  const [store] = useStore((store) => store[value])!;
  return (
    <div>
      {value}: {store}
    </div>
  );
};
const FormContainer = () => {
  return (
    <div className="border-cyan-600 border p-2 m-2">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
    </div>
  );
};
const DisplayContainer = () => {
  return (
    <div className="border-cyan-600 border p-2 m-2">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};
const ContentContainer = () => {
  console.count("ContentContainer");
  return (
    <div className="border-cyan-600 border p-2 m-2">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/context">Context API</Link>
              </li>
              <li>
                <Link to="/super-heroes">Traditional Super Heroes</Link>
              </li>
              <li>
                <Link to="/rq-super-heroes">RQ Super Heroes</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route
              path="/rq-super-heroes/:heroId"
              element={<RQSuperheroDetail />}
            />
            <Route path="/super-heroes" element={<SuperHeroesPage />}></Route>
            <Route
              path="/rq-super-heroes"
              element={<RQSuperHeroesPage />}
            ></Route>
            <Route
              path="/context"
              element={
                <StoreContext.Provider value={useStoreData()}>
                  <div className="border-cyan-600 border p-2 m-2">
                    <h5>App</h5>
                    <ContentContainer />
                  </div>
                  <BatchUpdating />
                </StoreContext.Provider>
              }
            ></Route>
            <Route path="/" element={<HomePage />}></Route>
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
