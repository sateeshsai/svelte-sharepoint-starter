import { p } from "sv-router/generated";

export const DASHBOARD_SAMPLE_DATA = $state({
  versions: ["1", "2", "3"],
  navMain: [
    {
      title: "First category",
      //   url: p("/admin/:category", { params: { category: "first-category" } }),
      items: [
        {
          title: "Section one ABC",
          //   url: p("/admin/:category/:section", { params: { category: "section-abc", section: "section-one-abc" } }),
        },
        {
          title: "Section one DEG",
          //   url: p("/admin/:category/:section", { params: { category: "section-abc", section: "section-one-deg" } }),
        },
      ],
    },
    {
      title: "Second category",
      //   url: p("/admin/:category", { params: { category: "second-category" } }),
      items: [
        {
          title: "Section two ABC",
          //   url: p("/admin/:category/:section", { params: { category: "section-abc", section: "section-two-abc" } }),
        },
        {
          title: "Section two JKL",
          //   url: p("/admin/:category/:section", { params: { category: "section-abc", section: "section-two-jkl" } }),
        },
        {
          title: "Section two MNO",
          //   url: p("/admin/:category/:section", { params: { category: "section-abc", section: "section-two-mno" } }),
        },
      ],
    },
  ],
});
