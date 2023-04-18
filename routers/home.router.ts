import {Router, Request, Response} from "express";
export const homeRouter = Router();
homeRouter
.get('/', async (req:Request, res:Response): Promise<void> => {
    res.send({ok:true});
})
