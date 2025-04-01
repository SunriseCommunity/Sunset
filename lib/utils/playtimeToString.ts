export const playtimeToString = (playtime: number) => {
    const hours = Math.floor(playtime / 1000 / 3600);
    const minutes = Math.floor(((playtime / 1000) % 3600) / 60);
    const seconds = Math.floor((playtime / 1000) % 60);

    return `${hours} H, ${minutes} M, ${seconds} S`;
  };