import { createSignal, Accessor, Suspense, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { createQuery } from '@tanstack/solid-query';
import { createVirtualizer } from '@tanstack/solid-virtual';

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
  color: ${(props) => (props.selected ? 'hotpink' : 'turquoise')};
`;

const UserInfo = styled.div`
  white-space: pre-line;
`;

const ConfigLabel = styled.label`
  font-size: 16px;
  color: teal;
`;

const API_URL = 'https://reactor.kinsle.ru';

const varFetch = async ({
  chelId,
  signal,
}: {
  chelId: Accessor<string>;
  signal: AbortSignal | undefined;
}) => {
  const response = await fetch(`${API_URL}/users/${chelId()}`, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

type UserSlice = {
  id: string;
  username: string;
  avatar: string;
};
type UserData = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  birthdate: string;
  registeredAt: string;
  city: string;
  vehicle: string;
};

function Index() {
  const [parentRef, setParentRef] = createSignal<HTMLDivElement>(
    null as unknown as HTMLDivElement,
  );
  const [chelId, setChelId] = createSignal('');
  const [cancelQuery, setCancelQuery] = createSignal(true);

  const users = createQuery<UserSlice[]>(() => ({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  }));

  const user = createQuery<UserData>(() => ({
    queryKey: ['user', chelId()],
    queryFn: cancelQuery()
      ? async ({ signal }) => varFetch({ chelId, signal })
      : async () => varFetch({ chelId, signal: undefined }),
    enabled: !!chelId(),
  }));

  const rowVirtualizer = createVirtualizer({
    get count() {
      return users.data?.length || 0;
    },
    getScrollElement: () => parentRef(),
    estimateSize: () => 24,
    overscan: 10,
  });

  return (
    <Center>
      <Suspense fallback="loading">
        <SideBar ref={setParentRef}>
          <ConfigLabel>
            <input
              type="checkbox"
              checked={cancelQuery()}
              onChange={() => setCancelQuery(!cancelQuery())}
            />
            Cancel query when unmount
          </ConfigLabel>
          <hr />
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            <For each={rowVirtualizer.getVirtualItems()}>
              {(virtualRow) => (
                <Show when={users.data?.[virtualRow.index]}>
                  {(userSlice) => (
                    <UserNickName
                      selected={chelId() === userSlice().id}
                      onClick={() => setChelId(userSlice().id)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {userSlice().username}
                    </UserNickName>
                  )}
                </Show>
              )}
            </For>
          </div>
        </SideBar>
      </Suspense>
      <UserInfo>
        <Suspense fallback="chel-loading">
          <Show when={user.isSuccess}>
            {JSON.stringify(user.data, null, 2)?.slice(2, -1)}
          </Show>
        </Suspense>
      </UserInfo>
    </Center>
  );
}

export default Index;
