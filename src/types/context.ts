import { Context } from "telegraf";
import { Update } from "telegraf/types";
import { HandlerContext } from "../handlers/types";

export interface BotContext extends Context<Update> {
  gameContext: HandlerContext;
}
