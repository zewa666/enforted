import { tragedyEvents } from "../../src/board/tragedy";

describe("tragedy events", () => {
  it("should have a total weight of 1", () => {
    const total = tragedyEvents.reduce((acc, curr) => {
      acc += curr.weight;
      return acc;
    }, 0);

    expect(total).toBeCloseTo(1);
  });
});
