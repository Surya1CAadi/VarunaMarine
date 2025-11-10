// backend/src/tests/unit/createPool.test.ts
import { createPoolAllocation } from "../../core/application/usecases/createPool";

describe("createPoolAllocation", () => {
  it("allocates surplus to deficits (simple)", () => {
    const members = [
      { shipId: "S1", cb_before: 1000 },
      { shipId: "S2", cb_before: -400 },
      { shipId: "S3", cb_before: -600 },
    ];
    const res = createPoolAllocation(members);
    // S1 should be 0, S2 and S3 should be 0
    const mS1 = res.find((r) => r.shipId === "S1")!;
    const mS2 = res.find((r) => r.shipId === "S2")!;
    const mS3 = res.find((r) => r.shipId === "S3")!;
    expect(mS1.cb_after).toBeCloseTo(0, 6);
    expect(mS2.cb_after).toBeCloseTo(0, 6);
    expect(mS3.cb_after).toBeCloseTo(0, 6);
  });

  it("preserves surplus if more than deficits", () => {
    const members = [
      { shipId: "A", cb_before: 1500 },
      { shipId: "B", cb_before: -400 },
      { shipId: "C", cb_before: -200 },
    ];
    const res = createPoolAllocation(members);
    const a = res.find((r) => r.shipId === "A")!;
    expect(a.cb_after).toBeCloseTo(900, 6); // 1500 - 400 - 200 = 900
  });

  it("throws when total negative", () => {
    const members = [
      { shipId: "X", cb_before: -100 },
      { shipId: "Y", cb_before: -50 },
    ];
    expect(() => createPoolAllocation(members)).toThrow();
  });
});
