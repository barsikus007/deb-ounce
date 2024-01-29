import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
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

const UserNickName = styled.div<{ selected: boolean }>`
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

const API_URL = 'https://reactor.kinsle.ru';

const varFetch = async ({ chelId, signal }: { chelId: string; signal: AbortSignal | undefined }) => {
  const response = await fetch(`${API_URL}/users/${chelId}`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function Index() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [chelId, setChelId] = useState('');
  const [cancelQuery, setCancelQuery] = useState(true);

  const { isLoading, data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
  const { isLoading: isUserLoading, data: userData } = useQuery({
    queryKey: ['user', chelId],
    queryFn: cancelQuery
      ? async ({ signal }) => varFetch({ chelId, signal })
      : async () => varFetch({ chelId, signal: undefined }),
    enabled: !!chelId,
  });

  const rowVirtualizer = useVirtualizer({
    count: usersData?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    overscan: 10,
  });

  const changeChel = (cchelId: string) => {
    setChelId(cchelId);
  };

  return (
    <Center>
      <SideBar ref={parentRef}>
        <CancelLabel>
          Cancel query when unmount
          <input type="checkbox" checked={cancelQuery} onChange={() => setCancelQuery(!cancelQuery)} />
        </CancelLabel>
        <hr />
        {isLoading ? (
          'loading'
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
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
            })}
          </div>
        )}
      </SideBar>
      <UserInfo>
        {isUserLoading ? 'chel-loading' : JSON.stringify(userData, null, 2)?.slice(2, -1)}
      </UserInfo>
    </Center>
  );
}

export default Index;
