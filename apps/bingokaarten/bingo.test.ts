import { describe, expect, test } from "bun:test";

// The app ships as one HTML file, so the tests pull the logic script out of it.
const html = await Bun.file(new URL("./index.html", import.meta.url)).text();
const src = html.match(/<script id="bingo-logic">([\s\S]*?)<\/script>/)![1];
const Bingo = new Function(`${src}; return Bingo;`)();

function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const words = Array.from({ length: 24 }, (_, i) => `woord ${i + 1}`);

describe("parseWords", () => {
  test("trims, drops blank lines and duplicates ignoring case", () => {
    expect(Bingo.parseWords("  Bomma \n\nbomma\nNonkel Jan\n")).toEqual(["Bomma", "Nonkel Jan"]);
  });
});

describe("cellCount", () => {
  test("free square only takes a cell on odd grids", () => {
    expect(Bingo.cellCount(5, true)).toBe(24);
    expect(Bingo.cellCount(5, false)).toBe(25);
    expect(Bingo.cellCount(4, true)).toBe(16);
    expect(Bingo.cellCount(3, true)).toBe(8);
  });
});

describe("validate", () => {
  test("words mode needs at least 24 words", () => {
    expect(Bingo.validate({ mode: "woorden", words: words.slice(0, 23), size: 3, free: true, count: 1 })).toMatch(/24/);
    expect(Bingo.validate({ mode: "woorden", words, size: 5, free: true, count: 40 })).toBeNull();
  });

  test("5×5 without free square needs 25 words", () => {
    expect(Bingo.validate({ mode: "woorden", words, size: 5, free: false, count: 1 })).toMatch(/25/);
  });

  test("count must be 1 to 40", () => {
    expect(Bingo.validate({ mode: "getallen", words: [], size: 5, free: true, count: 0 })).not.toBeNull();
    expect(Bingo.validate({ mode: "getallen", words: [], size: 5, free: true, count: 41 })).not.toBeNull();
  });
});

describe("makeCards", () => {
  test("number cards use one 1–75 range per column, sorted top to bottom", () => {
    const [card] = Bingo.makeCards({ mode: "getallen", words: [], size: 5, free: true, count: 1 }, seeded());
    expect(card).toHaveLength(25);
    expect(card[12]).toBe(Bingo.FREE);
    for (let col = 0; col < 5; col++) {
      const nums = [0, 1, 2, 3, 4].map((row) => card[row * 5 + col]).filter((v: unknown) => v !== Bingo.FREE);
      for (const n of nums) {
        expect(n).toBeGreaterThanOrEqual(col * 15 + 1);
        expect(n).toBeLessThanOrEqual(col * 15 + 15);
      }
      expect([...nums].sort((a, b) => a - b)).toEqual(nums);
    }
  });

  test("4×4 number columns cover 1–75 without overlap", () => {
    expect(Bingo.columnRanges(4)).toEqual([[1, 19], [20, 38], [39, 57], [58, 75]]);
  });

  test("word cards hold distinct words from the list and no free square on 4×4", () => {
    const [card] = Bingo.makeCards({ mode: "woorden", words, size: 4, free: true, count: 1 }, seeded());
    expect(card).toHaveLength(16);
    expect(new Set(card).size).toBe(16);
    expect(card.every((w: string) => words.includes(w))).toBe(true);
  });

  test("no two cards have the same layout, even when 24 words fill every 5×5 card", () => {
    const cards = Bingo.makeCards({ mode: "woorden", words, size: 5, free: true, count: 40 }, seeded(7));
    expect(new Set(cards.map((c: string[]) => c.join("|"))).size).toBe(40);
  });

  test("gives up instead of looping when unique cards are impossible", () => {
    const always0 = () => 0;
    expect(() => Bingo.makeCards({ mode: "woorden", words, size: 3, free: false, count: 2 }, always0)).toThrow();
  });
});

describe("caller", () => {
  test("draws every item exactly once, then stops", () => {
    const pool = Bingo.pool({ mode: "getallen", words: [] });
    expect(pool).toHaveLength(75);
    const drawn: number[] = [];
    const rng = seeded(3);
    for (let i = 0; i < 75; i++) drawn.push(Bingo.nextDraw(pool, drawn, rng));
    expect(new Set(drawn).size).toBe(75);
    expect(Bingo.nextDraw(pool, drawn, rng)).toBeNull();
  });

  test("labels numbers with their BINGO letter", () => {
    expect(Bingo.callLabel(1)).toBe("B");
    expect(Bingo.callLabel(31)).toBe("N");
    expect(Bingo.callLabel(75)).toBe("O");
  });
});
