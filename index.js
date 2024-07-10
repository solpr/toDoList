import appControl from "./source/server/server.js";

const port = process.env.PORT || 3000;

appControl.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});

