import { DocumentDefinition, ObjectDefinition } from "sanity";
import cloneDeep from "lodash/cloneDeep";
import Groups from "../setup/groups";

export const withDefaultGroup = (
  model: DocumentDefinition | ObjectDefinition
) => {
  if (!model.groups) {
    // eslint-disable-next-line no-param-reassign
    model.groups = [];
  }

  let defaultGroup = model.groups.find((group) => group.default);

  if (!defaultGroup) {
    defaultGroup = Groups.MAIN;

    if (defaultGroup) {
      model.groups.unshift(defaultGroup);
    }
  }

  model.fields.forEach((field, index) => {
    if (field.group || field.hidden === true) {
      return;
    }

    const fieldClone = cloneDeep(field);

    if (!fieldClone.group) {
      fieldClone.group = defaultGroup?.name;
    }

    // eslint-disable-next-line no-param-reassign
    model.fields[index] = fieldClone;
  });

  return model;
};
