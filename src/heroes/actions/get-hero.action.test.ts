import { describe, expect, test } from "vitest";
import { getHeroAction } from "./get-hero.action";

describe("get-hero.action", () => {
  test("Should fetch hero data and return with complete imagen url", async () => {
    const heroe = await getHeroAction("bruce-wayne");
    const imageUrl = "http://localhost:3001/images/2.jpeg";
    expect(heroe.image).toBe(imageUrl);
  });

  test("Should throw and error if hero is not found", async () => {
    const idSlug = "bruce-wayne222";

    await getHeroAction(idSlug).catch((error) => {
      //console.log(error.response);
      expect(error).toBeDefined();
      expect(error.message).toBe("Request failed with status code 404");
      expect(error.response.status).toBe(404);
    });
  });
});
