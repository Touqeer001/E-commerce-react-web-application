import megaMenu from "../data/megaMenu.js";

export const getMegaMenu = (req, res) => {

  res.status(200).json({
    success: true,
    data: megaMenu,
  });
};