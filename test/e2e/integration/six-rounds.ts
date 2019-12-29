function rollDice() {
  cy.get("[data-aid='btn-dice-roll']")
    .click();
}

function getPlayer() {
  return cy.get("[data-aid='player']");
}

interface TileDetails {
  id: string;
  type: string;
}

function getTileInfoForPlayer(): Promise<TileDetails> {
  return new Promise((resolve) => getPlayer().parent().then((elem) => {
    const vm = (elem[0] as any).au.controller.viewModel;

    resolve({
      id: vm.id,
      type: vm.type
    });
  }));
}

async function getCurrentRound() {
  return new Promise((resolve) => {
    cy.get(`[data-aid="current-round"]`).invoke("text").then((text) => {
      resolve(parseInt(text.toString().replace("Round ", ""), 10));
    });
  });
}

async function rollUntilTileType(type: string): Promise<void> {
  rollDice();

  const x = await getTileInfoForPlayer();
  if (x.type === type) {
    return;
  } else {
    return await rollUntilTileType(type);
  }
}

async function rollUntilRound(round: number): Promise<void> {
  rollDice();

  if (await getCurrentRound() === round) {
    cy.get(`[data-aid="current-round"]`).should("contain", "Round " + round.toString());
  } else {
    return await rollUntilRound(round);
  }
}

describe("Enforted base playthrough in order to achieve one of all outer buildings", () => {
  it("should manage to gather all buildings before 6 round", async () => {
    cy.visit("/");

    await rollUntilTileType("wood");
    getPlayer().dblclick()
      .get(`[data-aid="btn-buy"]`)
      .click();
    cy.log("Bought sawmill");

    await rollUntilTileType("stone");
    getPlayer().dblclick()
      .get(`[data-aid="btn-buy"]`)
      .click();
    cy.log("Bought quarry");

    rollUntilRound(3);
    cy.log("Finished round 2");

    rollUntilTileType("gold");
    getPlayer().dblclick()
      .get(`[data-aid="btn-buy"]`)
      .click();
    cy.log("Bought gold_mine");

    rollUntilRound(4);
    rollUntilRound(5);

    rollUntilTileType("food");
    getPlayer().dblclick()
      .get(`[data-aid="btn-buy"]`)
      .click();

    cy.log("Finished");
  });
});
