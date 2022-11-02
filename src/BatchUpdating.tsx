import React, { useEffect, useState } from "react";

type Props = {};
const getUserData = () => fetch("/user.json").then((res) => res.json());
const BatchUpdating = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [roles, setRoles] = useState<{ [key: string]: string }>({});
  const [roleList, setRoleList] = useState<string[]>([]);
  useEffect(() => {
    if (name) {
      setRoleList(Object.keys(roles).filter((k) => roles[k]));
    }
  }, [name, roles]);
  const onLoadUser = async () => {
    const data = await getUserData();
    //batching together run 1 time useEffect when set 2 state
    setName(data.name);
    setRoles(data.roles);
  };

  return (
    <div>
      <p>Name: {name}</p>
      <p>Roles: {JSON.stringify(roles, undefined, 2)}</p>
      <p>RoleList: {roleList.join(",")}</p>
      <button onClick={onLoadUser}>Load data</button>
    </div>
  );
};

export default BatchUpdating;
