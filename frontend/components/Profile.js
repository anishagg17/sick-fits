import React from "react";
import _Gravatar from "react-gravatar";
import styled from "styled-components";
import User from "./User";

const Name = styled.div`
  font-size: 3rem;
  span {
    color: #ff0000;
    font-weight: 400;
  }
`;
const Permission = styled.div`
  background: #ff0000;
  color: white;
  border-radius: 5px;
  box-siezing: border-box;
  width: fit-content;
  padding: 0.2rem 0.4rem;
`;

const About = styled.div`
  * {
    margin-bottom: 1rem;
  }
`;

const Flex = styled.div`
  display: flex;
  * {
    margin-left: 2rem;
  }
`;
const Gravatar = styled(_Gravatar)`
  border-radius: 50%;
`;

export default () => {
  return (
    <User>
      {({ data: { me } }) => {
        if (!me) return null;
        console.log("me", me);
        // const imgSrc = gravatar.url(email);
        const { name, email, permissions } = me;
        const isAdmin = permissions.filter(per => per === "ADMIN").length > 0;
        return (
          <Flex>
            <Gravatar
              email={email}
              size={200}
              rating="pg"
              default="monsterid"
            />
            <About>
              <Name>
                {name} <span>{email}</span>
              </Name>
              {isAdmin && <Permission>Admin</Permission>}
            </About>
          </Flex>
        );
      }}
    </User>
  );
};
