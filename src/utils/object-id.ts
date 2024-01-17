export const isValidObjectId = (id: string) => {
  return !!id.match(/^[0-9a-fA-F]{24}$/);
};
