import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";

type Props = {};

const fetchUserDetail = ({
  queryKey,
}: {
  queryKey: (string | undefined)[];
}) => {
  const heroId = queryKey![1];
  return axios.get(`http://localhost:4000/superheros/${heroId}`);
};
const RQSuperheroDetail = (props: Props) => {
  const { heroId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery(
    ["super-hero", heroId],
    fetchUserDetail,
    {
      initialData: (): any => {
        const hero = queryClient
          .getQueryData(["super-heroes"])
          ?.data?.find((hero: any) => hero.id === parseInt(heroId as string));
        if (hero) {
          return {
            data: hero,
          };
        } else {
          return undefined;
        }
      },
      select: (data: any) => {
        return data.data;
      },
    }
  );
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>{(error as { message: string }).message}</h1>;

  return (
    <div>
      RQSuperheroDetail
      <p>{data.name}</p>
    </div>
  );
};

export default RQSuperheroDetail;
