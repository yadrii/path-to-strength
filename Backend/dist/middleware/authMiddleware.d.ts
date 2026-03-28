import express from "express";
declare const verifyToken: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void | express.Response<any, Record<string, any>>>;
export default verifyToken;
//# sourceMappingURL=authMiddleware.d.ts.map