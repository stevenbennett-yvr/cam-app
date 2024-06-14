import { Kindred } from "../typing/content";
import { atom, selector } from "recoil";
import { Operation } from "@typing/operations";
import { DEFAULT_TRAITS } from "../process/traits/trait-manager";

const getOperationsFromTraits = (): Operation[] => {
  const operations: Operation[] = [];
  
  for (const traitKey in DEFAULT_TRAITS) {
    if (Object.prototype.hasOwnProperty.call(DEFAULT_TRAITS, traitKey)) {
      const trait = DEFAULT_TRAITS[traitKey];
      operations.push({
        id: `set_${traitKey}`,
        type: "setValue",
        data: {
          variable: traitKey,
          value: trait.value
        }
      });
    }
  }
  
  return operations;
};
const getEmptyKindred = (): Kindred => {
  return {
    id: 1,
    created_at: new Date().toISOString(),
    name: 'Unknown Kindred',
    operations: 
      getOperationsFromTraits()    
  }
}

const _internal_kindredState = atom({
  key: 'kindred-active-internal',
  default: getEmptyKindred() as Kindred | null,
});

const kindredState = selector({
  key: 'kindredState',
  get: ({ get }) => {
    const kindred = get(_internal_kindredState);
    kindred && saveKindred(kindred);
    return kindred;
  },
  set: ({ set }, newValue) => {
    if (newValue) {
      saveKindred(newValue as Kindred);
    } else {
      deleteKindred();
    }
    set(_internal_kindredState, newValue);
  },
});


function saveKindred(kindred: Kindred) {
  localStorage.setItem('kindred', JSON.stringify(kindred));
}

function deleteKindred() {
  localStorage.removeItem('kindred');
}

function loadKindred() {
  const kindred = localStorage.getItem('kindred');
  if (kindred) {
     return JSON.parse(kindred) as Kindred;
   }
  return null;
}

export { kindredState };