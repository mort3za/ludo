// tslint:disable-next-line: no-implicit-dependencies
import { shallowMount } from "@vue/test-utils";
import MarbleComponent from "@/components/Marble.vue";
import { listInitial } from "@/store/initials/marbles-initial.ts";

describe("Marble.vue", () => {
  it("renders props.model when passed", () => {
    const model = listInitial[0];
    const sideClassName = `is-side-${model.side}`
    const wrapper = shallowMount(MarbleComponent, {
      propsData: { model }
    });
    console.log(wrapper, wrapper.classes());
    expect(wrapper.classes()).toContain(sideClassName);
  });
});
