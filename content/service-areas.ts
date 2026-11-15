/**
 * Service-area model: counties, cities, the ZIP allowlist used by the quote
 * gate, and future city slugs for /service-area/[slug].
 *
 * PLACEHOLDER values — the project owner must supply the real coverage list.
 */

export type ServiceCounty = {
  name: string;
  cities: string[];
};

export const serviceCounties: ServiceCounty[] = [
  {
    name: "Miami-Dade",
    cities: [
      "Coral Gables",
      "Pinecrest",
      "South Miami",
      "Coconut Grove",
      "Key Biscayne",
      "Palmetto Bay",
      "Miami Shores",
      "Doral",
    ],
  },
  {
    name: "Broward",
    cities: [
      "Weston",
      "Southwest Ranches",
      "Davie",
      "Cooper City",
      "Pembroke Pines",
      "Miramar",
    ],
  },
];

/** Pills shown under the gallery. Order matters. */
export const featuredAreas = [
  "Coral Gables",
  "Pinecrest",
  "Coconut Grove",
  "Key Biscayne",
  "South Miami",
  "Palmetto Bay",
  "Cutler Bay",
  "Doral",
  "Weston",
  "Pembroke Pines",
];

export const areasFootnote =
  "And the rest of Miami-Dade, plus parts of Broward. Not sure we reach you? Call and ask.";

/**
 * ZIP allowlist for the quote gate. PLACEHOLDER — sample Miami-Dade and
 * Broward ZIPs. Replace with the owner's verified coverage list.
 */
export const serviceZips: ReadonlySet<string> = new Set([
  // Miami-Dade (sample)
  "33101",
  "33109",
  "33125",
  "33126",
  "33127",
  "33128",
  "33129",
  "33130",
  "33131",
  "33132",
  "33133",
  "33134",
  "33135",
  "33136",
  "33137",
  "33138",
  "33139",
  "33140",
  "33141",
  "33142",
  "33143",
  "33144",
  "33145",
  "33146",
  "33147",
  "33149",
  "33150",
  "33154",
  "33155",
  "33156",
  "33157",
  "33158",
  "33160",
  "33161",
  "33162",
  "33165",
  "33166",
  "33167",
  "33168",
  "33169",
  "33170",
  "33172",
  "33173",
  "33174",
  "33175",
  "33176",
  "33177",
  "33178",
  "33179",
  "33180",
  "33181",
  "33182",
  "33183",
  "33184",
  "33185",
  "33186",
  "33187",
  "33189",
  "33190",
  "33193",
  "33194",
  "33196",
  // Broward (sample)
  "33004",
  "33009",
  "33019",
  "33020",
  "33021",
  "33023",
  "33024",
  "33025",
  "33026",
  "33027",
  "33028",
  "33029",
  "33301",
  "33304",
  "33305",
  "33306",
  "33308",
  "33311",
  "33312",
  "33313",
  "33314",
  "33315",
  "33316",
  "33317",
  "33319",
  "33321",
  "33322",
  "33323",
  "33324",
  "33325",
  "33326",
  "33327",
  "33328",
  "33330",
  "33331",
  "33332",
  "33334",
  "33351",
]);

export function isZipInArea(zip: string): boolean {
  return serviceZips.has(zip);
}

/** Future /service-area/[slug] routes. Generate a page only when the city has unique content. */
export const futureCitySlugs = [
  { slug: "coral-gables", city: "Coral Gables", county: "Miami-Dade" },
  { slug: "pinecrest", city: "Pinecrest", county: "Miami-Dade" },
  { slug: "weston", city: "Weston", county: "Broward" },
] as const;
