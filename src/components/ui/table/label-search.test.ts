import { tableLabelSearchScore } from "./label-search"

describe("tableLabelSearchScore", () => {
  it("matches any contiguous part of the label, in any word order, ignoring case", () => {
    expect(tableLabelSearchScore("Name", "ame")).toBe(1)
    expect(tableLabelSearchScore("Name", "am")).toBe(1)
    expect(tableLabelSearchScore("Name", "nam")).toBe(1)
    expect(tableLabelSearchScore("Name", "NAM")).toBe(1)
    expect(tableLabelSearchScore("Est Hours Today", "today hours")).toBe(1)
    expect(tableLabelSearchScore("Joined", "oin")).toBe(1)
  })

  it("keeps special characters in the match", () => {
    expect(tableLabelSearchScore("R&D", "&")).toBe(1)
    expect(tableLabelSearchScore("R&D", "r&d")).toBe(1)
    expect(tableLabelSearchScore("R&D", "rd")).toBe(0)
    expect(tableLabelSearchScore("user@host", "@")).toBe(1)
    expect(tableLabelSearchScore("user@host", "user@")).toBe(1)
    expect(tableLabelSearchScore("Email", "@")).toBe(0)
    expect(tableLabelSearchScore("Email", "&")).toBe(0)
  })

  it("rejects a query that is not a contiguous part of the label", () => {
    expect(tableLabelSearchScore("Email", "eemmaail")).toBe(0)
    expect(tableLabelSearchScore("Joined", "je")).toBe(0)
  })

  it("shows every option when the query has no words", () => {
    expect(tableLabelSearchScore("Email", "")).toBe(1)
    expect(tableLabelSearchScore("Email", "   ")).toBe(1)
  })
})