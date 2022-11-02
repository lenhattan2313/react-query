import axios from "axios";
import React, { useState, useEffect } from "react";

type Props = {};

const Superheros = (props: Props) => {
  const [data, setData] = useState<{ data?: any[] }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  //   useEffect(() => {
  //     setIsLoading(true);
  //     let source = axios.CancelToken.source();

  //     axios.get("http://localhost:4000/superheros", { cancelToken: source.token }).then((res) => {
  //       setData(res.data);
  //       setIsLoading(false);

  //     });
  //     return () => {
  //       source.cancel();
  //     };
  //   }, []);
  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    let isMounted = true;
    fetch("http://localhost:4000/superhero1s", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
    return () => {
      controller.abort();
      isMounted = false;
    };
  }, []);
  if (isLoading) return <h1>Loading ...</h1>;
  if (error) return <h1>{error}</h1>;
  return (
    <div>
      <h1>Superheros</h1>
      {data?.map((s: any) => (
        <p key={s.name}>{s.name}</p>
      ))}
    </div>
  );
};

export default Superheros;
