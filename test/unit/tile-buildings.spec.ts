import { BASE_DMG, DMG_PER_SOLDIER, TileBuilding } from "../../src/buildings/tile-building";

describe("tile buildings", () => {
  it("should have a base dmg", () => {
    const sut = new TileBuilding();

    expect(sut.dmg).toBe(BASE_DMG);
  });

  it("should deal additional with manned soldiers", () => {
    const sut = new TileBuilding();
    sut.garrison = 3;

    expect(sut.dmg).toBe(BASE_DMG + (sut.garrison * DMG_PER_SOLDIER));
  });
});
