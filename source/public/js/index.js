import themeInit from "./utility/theme.js";
import { editTask } from "./controllers/formController.js";
import { homeController } from "./controllers/homeController.js";

document.addEventListener("DOMContentLoaded", async () => {
    themeInit();
    homeController();
});
