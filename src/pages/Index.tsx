// @ts-nocheck
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import { useVirtualizer } from '@tanstack/react-virtual';

const Center = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const SideBar = styled.div`
  overflow-y: auto;
  height: 100vh;
  width: 250px;
`;

const UserNickName = styled.div`
  cursor: pointer;
  color: ${props => (props.selected ? 'hotpink' : 'turquoise')};
`;

const UserInfo = styled.div`
  white-space: pre-line;
`;

const CancelLabel = styled.label`
  font-size: 24px;
  color: teal;
`;

const varFetch = async ({ chelId, signal }) => {
  const response = await fetch(`https://reactor.kinsle.ru/users/${chelId}`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function Index() {
  const parentRef = useRef();
  const [chelId, setChelId] = useState();
  const [cancelQuery, setCancelQuery] = useState(true);

  const {
    isLoading, data: usersData,
  } = useQuery('users', async () => {
    const response = await fetch('https://reactor.kinsle.ru/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
  const {
    isLoading: isUserLoading, data: userData,
  } = useQuery(
    ['user', chelId],
    cancelQuery ? async ({ signal }) => varFetch({ chelId, signal }) : async () => varFetch({ chelId }),
    {
      enabled: !!chelId,
    },
  );

  const rowVirtualizer = useVirtualizer({
    count: usersData?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    overscan: 10,
  });

  const changeChel = cchelId => {
    setChelId(cchelId);
  };

  return (
    <Center>
      {isLoading ? 'loading' : (
        <SideBar
          ref={parentRef}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(
              virtualRow => {
                const chel = usersData[virtualRow.index];
                return (
                  <UserNickName
                    selected={chelId === chel.id}
                    key={chel.id}
                    onClick={() => changeChel(chel.id)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {chel.username}
                  </UserNickName>
                );
              },
            )}
          </div>
        </SideBar>
      )}
      <UserInfo>
        <CancelLabel>
          Cancel query when unmount
          <input type="checkbox" checked={cancelQuery} onChange={() => setCancelQuery(!cancelQuery)} />
        </CancelLabel>
        <br />
        {isUserLoading ? 'chel-loading' : (
          JSON.stringify(userData, null, 2)?.slice(2, -1)
        )}
      </UserInfo>
    </Center>
  );
}

export default Index;
