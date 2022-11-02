export const fromArrayToMap = (
  arr: string[] | undefined | null
): { [key: string]: string } => {
  if (!arr) throw new Error("Attributes array is empty");

  let obj: { [key: string]: string } = {};

  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] = "";
  }

  return obj;
};
