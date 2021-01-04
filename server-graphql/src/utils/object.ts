interface ObjectType {
  [key: string]: any;
}

export const pickExisting = (obj: ObjectType) => {
  return Object.keys(obj).reduce<ObjectType>((acc, cur) => {
    if (obj[cur]) {
      return { ...acc, cur: obj[cur] };
    }
    return acc;
  }, {});
};
