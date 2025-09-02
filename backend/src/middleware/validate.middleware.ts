import { AnyZodObject, ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { Unprocessable } from '../utils/errors'

export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      req.body = parsed.body
      req.query = parsed.query
      req.params = parsed.params
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return next(Unprocessable('Validation failed', e.flatten()))
      }
      next(e)
    }
  }
}