import { pino } from "pino";

export default pino({
  transport: {
    targets: [
      { target: "pino-pretty" },
      {
        target: "pino/file",
        options: { destination: `${new Date().toISOString()}.log` },
      },
    ],
  },
});
