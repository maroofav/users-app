export const getAvatar = (avatar: string, size: string) => {
  return avatar.replace('?size=50x50', `?size=${size}x${size}`)
}
