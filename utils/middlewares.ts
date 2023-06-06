import { NextFunction, Request, Response } from "express";

export const checkParams = (params: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    params.forEach((name) => {
      if (!req.body[name]) throw new Error(`Параметр: ${name} обов'язковий!`);
    });

    next();
  };
};

export const checkQueryStringParams = (params: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    params.forEach((name) => {
      if (!req.params[name]) throw new Error(`Параметр: ${name} обов'язковий!`);
    });

    next();
  };
};
