export async function getServerStatus(): Promise<ServerStatus> {
  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/status`
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response) {
    return {
      is_online: false,
      users_online: 0,
      total_users: 0,
    };
  }

  return response;
}

interface ServerStatus {
  is_online: boolean;
  users_online: number;
  total_users: number;
}
