import React, { LegacyRef, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Link } from "react-router-dom";

type Props = {};
const fetchData = () => {
  return axios.get("http://localhost:4000/superheros");
};
const addData = (hero: any) => {
  return axios.post("http://localhost:4000/superheros", hero);
};
const RQSuperheros = (props: Props) => {
  const inputName = useRef<HTMLInputElement>(null);
  const inputAlterEgo = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [poll, setPoll] = useState<number | false>(3000);
  const onSuccess = (data: any) => {
    if (data.data.length === 4) {
      setPoll(false);
    }
  };
  const { data, isLoading, error, isError, isFetching, refetch } = useQuery(
    "super-heroes",
    fetchData
    // { cacheTime: 5000 } //5sec
    // { staleTime: 20000, enabled: false } // not fetch data in 20s
    // { refetchInterval: poll, onSuccess }
  );
  const { mutate } = useMutation(addData, {
    // onSuccess: (data) => {
    //   // queryClient.invalidateQueries("super-heroes"); //refresh data, need to call 1 api to refresh data

    //   queryClient.setQueriesData("super-heroes", (oldQuerydata: any) => { //k cần gọi api để refresh lấy data trả về của api mutate
    //     return {
    //       ...oldQuerydata,
    //       data: [...oldQuerydata.data, data.data],
    //     };
    //   });
    // },

    onMutate: async (newHero) => {
      await queryClient.cancelQueries("super-heroes");
      const preQueryData = queryClient.getQueriesData("super-heroes");
      queryClient.setQueryData("super-heroes", (oldQuerydata: any) => {
        return {
          ...oldQuerydata,
          data: [
            ...oldQuerydata.data,
            {
              id: oldQuerydata.length + 1,
              ...newHero,
            },
          ],
        };
      });
      return preQueryData;
    },
    onError: (_error, _hero, context: { preQueryData: any }) => {
      queryClient.setQueryData("super-heroes", context?.preQueryData);
    },
    onSettled: () => {
      queryClient.invalidateQueries("super-heroes"); //refresh data whenever success or failed mutation
    },
  });

  const handleAddHero = () => {
    const hero = {
      name: inputName.current?.value,
      alterEgo: inputAlterEgo.current?.value,
    };
    console.log(hero);
    mutate(hero);
  };
  // query cache in 5 mins
  // console.log({ isLoading, isFetching });
  if (isLoading) {
    return <h1>Loading ...</h1>;
  }
  if (isError) return <h1>{(error as { message: string }).message}</h1>;
  // console.log(data);
  return (
    <div>
      <h1>RQSuperheros</h1>
      <input ref={inputName} type="text" />
      <input ref={inputAlterEgo} type="text" />
      <button onClick={handleAddHero}>Add hero</button>
      <div>
        <button onClick={refetch}>Fetch data</button>
      </div>
      {data?.data?.map((s: any) => (
        <div key={s.name}>
          <Link to={`/rq-super-heroes/${s.id}`}>{s.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default RQSuperheros;
